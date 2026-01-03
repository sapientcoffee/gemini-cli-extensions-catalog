import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";

initializeApp();
const db = getFirestore();

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
        // 1. Validation & Security Scan (Placeholder)
        // In a real implementation, we would clone the repo and scan it here.
        // For now, we'll do a basic check on the URL.
        
        let status = 'pending';
        let statusMessage = 'Waiting for admin approval.';

        if (!repoUrl || typeof repoUrl !== 'string' || !repoUrl.startsWith('http')) {
             status = 'rejected';
             statusMessage = 'Invalid Repository URL.';
             logger.warn(`Submission ${docId} rejected: Invalid URL.`);
        } else {
             logger.info(`Submission ${docId} passed initial validation.`);
        }

        // 2. Update the document with the result
        await snapshot.ref.update({
            status: status,
            statusMessage: statusMessage,
            updatedAt: new Date().toISOString()
        });

    } catch (error) {
        logger.error(`Error processing submission ${docId}`, error);
        await snapshot.ref.update({
            status: 'error',
            statusMessage: 'Internal processing error.'
        });
    }
});


// Function B: approveSubmission (Callable)
// Allows an admin to approve a submission, moving it to the 'registry' collection.
export const approveSubmission = onCall(async (request) => {
    // 1. Verify Authentication
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    // 2. Verify Admin Role (Simple email check for V1)
    const userEmail = request.auth.token.email || '';
    // TODO: Move admin list to environment configuration or database
    const ADMIN_EMAILS = ['admin@cymbal.coffee', 'robedwards@cymbal.coffee']; 
    
    if (!userEmail.endsWith('@cymbal.coffee') || !ADMIN_EMAILS.includes(userEmail)) {
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
            approvedBy: userEmail,
            approvedAt: new Date().toISOString()
        });

        // Update submission status
        await submissionRef.update({
            status: 'approved',
            registryId: submissionId
        });

        logger.info(`Submission ${submissionId} approved by ${userEmail}`);
        return { success: true, registryId: submissionId };

    } catch (error) {
        logger.error("Error approving submission", error);
        if (error instanceof HttpsError) throw error;
        throw new HttpsError('internal', 'Unable to approve submission.');
    }
});