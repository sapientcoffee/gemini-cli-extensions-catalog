/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

const admin = require('firebase-admin');

// Initialize with ADC or Project ID
const projectId = process.env.GOOGLE_CLOUD_PROJECT || 'gemini-cli-extensions-catalog';

if (!admin.apps.length) {
    admin.initializeApp({
        projectId: projectId
    });
}

const email = process.argv[2];

if (!email) {
    console.error('Please provide an email address: node grant_admin.js <email>');
    process.exit(1);
}

async function grantAdmin(email) {
    try {
        console.log(`Looking up user ${email}...`);
        const user = await admin.auth().getUserByEmail(email);
        console.log(`Found user ${user.uid}. Granting admin claim...`);
        
        // Get existing claims to avoid overwriting others (if any)
        const currentClaims = user.customClaims || {};
        await admin.auth().setCustomUserClaims(user.uid, { ...currentClaims, admin: true });
        
        console.log(`Success! Admin claim granted to ${email}`);
        process.exit(0);
    } catch (error) {
        console.error('Error granting admin claim:', error.message);
        process.exit(1);
    }
}

grantAdmin(email);
