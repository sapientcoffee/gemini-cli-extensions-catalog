/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'server-only';
import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin
// In App Hosting, GOOGLE_APPLICATION_CREDENTIALS is auto-handled.
const app = getApps().length === 0 ? initializeApp() : getApp();

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);
