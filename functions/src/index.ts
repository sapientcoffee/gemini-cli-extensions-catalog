import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

initializeApp();
const db = getFirestore();
const auth = getAuth();

// Bootstrap list of Super Admins (immutable via code)
const SUPER_ADMINS = ['admin@cymbal.coffee', 'robedwards@cymbal.coffee', 'admin@robedwards.altostrat.com'];

// Helper to check admin status
function isAdmin(request: any): boolean {
    if (!request.auth) return false;
    const email = request.auth.token.email || '';
    const hasClaim = request.auth.token.admin === true;
    return hasClaim || SUPER_ADMINS.includes(email);
}

// Function A: onSubmissionCreated (Firestore Trigger)
// Triggers when a new document is created in the 'submissions' collection.
export const onSubmissionCreated = onDocumentCreated("submissions/{docId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        logger.error("No data associated with the event");
        return;
    }

    const data = snapshot.data();
    const docId = event.params.docId;
    const repoUrl = data.repoUrl;

    logger.info(`Processing new submission: ${docId} from ${repoUrl}`);

    try {
        // 1. Basic URL Validation
        if (!repoUrl || typeof repoUrl !== 'string' || !repoUrl.startsWith('http')) {
             await snapshot.ref.update({
                status: 'rejected',
                statusMessage: 'Invalid Repository URL.',
                updatedAt: new Date().toISOString()
             });
             return;
        }

        // 2. Extract Owner/Repo
        // Expected format: https://github.com/owner/repo or similar
        const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!match) {
            await snapshot.ref.update({
                status: 'rejected',
                statusMessage: 'URL must be a valid GitHub repository.',
                updatedAt: new Date().toISOString()
             });
             return;
        }

        const owner = match[1];
        const repo = match[2].replace(/\.git$/, ''); // Remove .git if present

        // 3. Fetch gemini-extension.json
        // Try 'main' branch first, then 'master'
        let manifest = null;
        let manifestUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/gemini-extension.json`;
        
        let response = await fetch(manifestUrl);
        if (!response.ok) {
            // Try master
            manifestUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/gemini-extension.json`;
            response = await fetch(manifestUrl);
        }

        if (!response.ok) {
             await snapshot.ref.update({
                status: 'rejected',
                statusMessage: 'Could not find gemini-extension.json in main or master branch.',
                updatedAt: new Date().toISOString()
             });
             return;
        }

        // 4. Parse & Validate JSON
        try {
            manifest = await response.json();
        } catch (e) {
            await snapshot.ref.update({
                status: 'rejected',
                statusMessage: 'gemini-extension.json is not valid JSON.',
                updatedAt: new Date().toISOString()
            });
            return;
        }

        if (!manifest.name || !manifest.description) {
             await snapshot.ref.update({
                status: 'rejected',
                statusMessage: 'Manifest missing required fields: name, description.',
                updatedAt: new Date().toISOString()
             });
             return;
        }

        // 5. Success! Update Document
        // We trust the manifest more than the user's manual input for Name/Desc
        logger.info(`Submission ${docId} validated. Manifest found at ${manifestUrl}`);
        
        await snapshot.ref.update({
            status: 'pending',
            statusMessage: 'Manifest verified. Waiting for admin approval.',
            name: manifest.name, // Overwrite with source of truth
            description: manifest.description, // Overwrite
            version: manifest.version || '0.0.1',
            manifestUrl: manifestUrl,
            updatedAt: new Date().toISOString()
        });

    } catch (error) {
        logger.error(`Error processing submission ${docId}`, error);
        await snapshot.ref.update({
            status: 'error',
            statusMessage: 'Internal processing error during validation.',
            updatedAt: new Date().toISOString()
        });
    }
});


// Function B: approveSubmission (Callable)
// Allows an admin to approve a submission, moving it to the 'registry' collection.
export const approveSubmission = onCall({ cors: true }, async (request) => {
    // 1. Verify Authentication
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    // 2. Verify Admin Role
    if (!isAdmin(request)) {
        throw new HttpsError('permission-denied', 'Only admins can approve submissions.');
    }

    const { submissionId } = request.data;
    if (!submissionId) {
        throw new HttpsError('invalid-argument', 'The function must be called with a "submissionId".');
    }

    try {
        // 3. Move data from 'submissions' to 'registry'
        const submissionRef = db.collection('submissions').doc(submissionId);
        const submissionSnap = await submissionRef.get();

        if (!submissionSnap.exists) {
            throw new HttpsError('not-found', 'Submission not found.');
        }

        const submissionData = submissionSnap.data();
        
        if (submissionData?.status !== 'pending') {
             throw new HttpsError('failed-precondition', 'Submission is not in "pending" state.');
        }

        // Create new registry entry
        const registryRef = db.collection('registry').doc(submissionId); // Use same ID
        await registryRef.set({
            ...submissionData,
            status: 'approved',
            approvedBy: request.auth.token.email,
            approvedAt: new Date().toISOString()
        });

        // Update submission status
        await submissionRef.update({
            status: 'approved',
            registryId: submissionId
        });

        logger.info(`Submission ${submissionId} approved by ${request.auth.token.email}`);
        return { success: true, registryId: submissionId };

    } catch (error) {
        logger.error("Error approving submission", error);
        if (error instanceof HttpsError) throw error;
        throw new HttpsError('internal', 'Unable to approve submission.');
    }
});

// Function C: grantAdminRole (Callable)
// Allows an existing admin to grant the admin role to another user by email.
export const grantAdminRole = onCall({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    if (!isAdmin(request)) {
        throw new HttpsError('permission-denied', 'Only admins can grant admin roles.');
    }

    const { email } = request.data;
    if (!email) {
        throw new HttpsError('invalid-argument', 'The function must be called with an "email".');
    }

    try {
        const user = await auth.getUserByEmail(email);
        await auth.setCustomUserClaims(user.uid, { admin: true });
        logger.info(`Admin role granted to ${email} by ${request.auth.token.email}`);
        return { success: true, message: `Admin role granted to ${email}` };
    } catch (error) {
        logger.error("Error granting admin role", error);
        throw new HttpsError('internal', `Unable to grant admin role: ${error}`);
    }
});