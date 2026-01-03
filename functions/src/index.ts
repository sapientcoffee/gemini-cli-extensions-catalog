/**
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

initializeApp();
const db = getFirestore();
const auth = getAuth();

// Security Scanner Helper
function hasSecrets(text: string): boolean {
    // Basic regex for Google API Key (AIza...)
    const googleApiKey = /AIza[0-9A-Za-z-_]{35}/;
    // Add more patterns as needed (AWS, etc)
    return googleApiKey.test(text);
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
        const match = repoUrl.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)/);
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
        const manifestText = await response.text();
        
        // Security Scan
        if (hasSecrets(manifestText)) {
             logger.warn(`Security alert: Potential API key detected in ${repoUrl}`);
             await snapshot.ref.update({
                status: 'rejected',
                statusMessage: 'Security Violation: Potential API Key detected in manifest.',
                updatedAt: new Date().toISOString()
             });
             return;
        }

        try {
            manifest = JSON.parse(manifestText);
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

        // Fix GitHub Blob URLs to Raw URLs for images
        let finalImageUrl = manifest.imageUrl || data.imageUrl;
        if (finalImageUrl && typeof finalImageUrl === 'string') {
            // Convert https://github.com/user/repo/blob/branch/path -> https://raw.githubusercontent.com/user/repo/branch/path
            finalImageUrl = finalImageUrl.replace(
                /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)$/,
                'https://raw.githubusercontent.com/$1/$2/$3/$4'
            );
        }
        
        await snapshot.ref.update({
            status: 'pending',
            statusMessage: 'Manifest verified. Waiting for admin approval.',
            name: manifest.name, // Overwrite with source of truth
            description: manifest.description, // Overwrite
            version: manifest.version || '0.0.1',
            manifestUrl: manifestUrl,
            imageUrl: finalImageUrl || null,
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