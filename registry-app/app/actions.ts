/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

'use server';

import { adminAuth, adminDb } from '../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

async function verifyAuth(token: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (e) {
    throw new Error('Unauthorized');
  }
}

async function verifyAdmin(token: string) {
  const user = await verifyAuth(token);
  const hasClaim = user.admin === true;
  
  if (!hasClaim) {
    throw new Error('Permission Denied: Admins only.');
  }
  return user;
}

export async function approveSubmissionAction(token: string, submissionId: string) {
  const user = await verifyAdmin(token);
  
  const submissionRef = adminDb.collection('submissions').doc(submissionId);
  const submissionSnap = await submissionRef.get();

  if (!submissionSnap.exists) throw new Error('Submission not found');
  const data = submissionSnap.data();

  // Create in Registry
  await adminDb.collection('registry').doc(submissionId).set({
    ...data,
    status: 'approved',
    approvedBy: user.email,
    approvedAt: new Date().toISOString()
  });

  // Update Submission
  await submissionRef.update({
    status: 'approved',
    registryId: submissionId
  });

  return { success: true };
}

export async function grantAdminRoleAction(token: string, email: string) {
  const adminUser = await verifyAdmin(token);
  
  const user = await adminAuth.getUserByEmail(email);
  await adminAuth.setCustomUserClaims(user.uid, { admin: true });
  
  return { success: true, message: `Admin role granted to ${email}` };
}

export async function rejectSubmissionAction(token: string, submissionId: string) {
  const user = await verifyAdmin(token);
  
  await adminDb.collection('submissions').doc(submissionId).update({
    status: 'rejected',
    rejectedAt: new Date().toISOString(),
    rejectedBy: user.email
  });

  return { success: true };
}

export async function resubmitExtensionAction(token: string, submissionId: string) {
  const user = await verifyAuth(token);
  
  const ref = adminDb.collection('submissions').doc(submissionId);
  const snap = await ref.get();
  
  if (!snap.exists) throw new Error('Not found');
  const data = snap.data();

  if (data?.submittedBy !== user.uid) {
      throw new Error('You can only resubmit your own extensions.');
  }

  await ref.update({
      status: 'pending',
      resubmittedAt: new Date().toISOString()
      // Ideally we trigger validation again here or via Firestore trigger
  });

  return { success: true };
}
