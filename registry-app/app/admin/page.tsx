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

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import AuthGuard from '../../components/AuthGuard';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { approveSubmissionAction, rejectSubmissionAction, grantAdminRoleAction } from '../actions';

interface Submission {
  id: string;
  name: string;
  submittedByEmail: string;
  repoUrl: string;
  category: string;
  status: string;
  submittedAt: any;
  approvedBy?: string;
  approvedAt?: any;
  rejectedBy?: string;
  rejectedAt?: any;
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [adminStatus, setAdminStatus] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    let q;
    if (activeTab === 'all') {
        q = query(collection(db, 'submissions'), orderBy('submittedAt', 'desc'));
    } else {
        q = query(collection(db, 'submissions'), where('status', '==', activeTab), orderBy('submittedAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subs: Submission[] = [];
      snapshot.forEach((doc) => {
        subs.push({ id: doc.id, ...doc.data() } as Submission);
      });
      setSubmissions(subs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeTab]);

  const handleApprove = async (id: string) => {
    try {
        const token = await user?.getIdToken();
        if (!token) throw new Error("No auth token");
        await approveSubmissionAction(token, id);
    } catch (error) {
        console.error("Error approving submission:", error);
        alert("Failed to approve submission.");
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this submission?")) return;
    try {
        const token = await user?.getIdToken();
        if (!token) throw new Error("No auth token");
        await rejectSubmissionAction(token, id);
    } catch (error) {
        console.error("Error rejecting submission:", error);
        alert("Failed to reject submission.");
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newAdminEmail) return;
    setAdminStatus('Adding...');
    try {
        const token = await user?.getIdToken();
        if (!token) throw new Error("No auth token");
        await grantAdminRoleAction(token, newAdminEmail);
        setAdminStatus(`Success! ${newAdminEmail} is now an admin.`);
        setNewAdminEmail('');
    } catch (error) {
        console.error(error);
        setAdminStatus('Error adding admin. Ensure email exists in Auth.');
    }
  };

  return (
    <AuthGuard adminOnly>
        <div className="min-h-screen flex flex-col bg-warm-crema">
        <Header />

        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                
                {/* Admin Management Section */}
                <div className="mb-12 bg-white rounded-lg shadow-sm border border-rich-espresso/5 p-6">
                    <h2 className="text-xl font-bold font-heading text-rich-espresso mb-4">Manage Admins</h2>
                    <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="w-full sm:max-w-md">
                            <label htmlFor="adminEmail" className="block text-sm font-medium text-rich-espresso/70 mb-1">Grant Admin Role to Email</label>
                            <input 
                                id="adminEmail"
                                type="email" 
                                placeholder="colleague@cymbal.coffee"
                                className="w-full h-10 rounded-md border border-rich-espresso/20 px-3 text-rich-espresso focus:outline-none focus:ring-2 focus:ring-cymbal-gold"
                                value={newAdminEmail}
                                onChange={(e) => setNewAdminEmail(e.target.value)}
                            />
                        </div>
                        <button 
                            type="submit"
                            className="h-10 px-6 bg-rich-espresso text-warm-crema font-bold rounded-md hover:opacity-90 transition-opacity"
                        >
                            Grant Role
                        </button>
                    </form>
                    {adminStatus && (
                        <p className={`mt-3 text-sm font-medium ${adminStatus.startsWith('Success') ? 'text-green-600' : 'text-red-600'}`}>
                            {adminStatus}
                        </p>
                    )}
                </div>

                {/* Page Heading */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold font-heading text-rich-espresso mb-2">Submissions</h1>
                    <p className="text-rich-espresso/80">Manage and review extension submissions.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-rich-espresso/10">
                    {['pending', 'approved', 'rejected', 'all'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-3 font-bold text-sm uppercase tracking-wide transition-all border-b-2 ${
                                activeTab === tab 
                                ? 'border-cymbal-gold text-rich-espresso' 
                                : 'border-transparent text-rich-espresso/50 hover:text-rich-espresso hover:bg-rich-espresso/5'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm border border-rich-espresso/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-rich-espresso/5 border-b border-rich-espresso/10">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-bold text-rich-espresso">Extension Name</th>
                                    <th className="px-6 py-4 text-sm font-bold text-rich-espresso">Submitted By</th>
                                    <th className="px-6 py-4 text-sm font-bold text-rich-espresso">Date</th>
                                    <th className="px-6 py-4 text-sm font-bold text-rich-espresso">Status</th>
                                    
                                    {activeTab === 'approved' && <th className="px-6 py-4 text-sm font-bold text-rich-espresso">Approved By</th>}
                                    {activeTab === 'rejected' && <th className="px-6 py-4 text-sm font-bold text-rich-espresso">Rejected By</th>}
                                    
                                    {(activeTab === 'pending' || activeTab === 'all') && <th className="px-6 py-4 text-sm font-bold text-rich-espresso text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-rich-espresso/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-rich-espresso/60">Loading...</td>
                                    </tr>
                                ) : submissions.length > 0 ? (
                                    submissions.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-rich-espresso/5 transition-colors">
                                            <td className="px-6 py-4 font-bold text-rich-espresso">
                                                {sub.name}
                                                <div className="text-xs font-normal text-rich-espresso/60 mt-1">
                                                    <a href={sub.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-coffee-accent">
                                                        {sub.repoUrl.replace('https://github.com/', '')}
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-rich-espresso/80 text-sm">{sub.submittedByEmail}</td>
                                            <td className="px-6 py-4 text-sm text-rich-espresso/60">
                                                {sub.submittedAt?.toDate().toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize
                                                    ${sub.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                                      sub.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                      'bg-yellow-100 text-yellow-800'}`}>
                                                    {sub.status}
                                                </span>
                                            </td>

                                            {activeTab === 'approved' && (
                                                <td className="px-6 py-4 text-sm text-rich-espresso/80">
                                                    {sub.approvedBy}<br/>
                                                    <span className="text-xs text-rich-espresso/50">{sub.approvedAt && new Date(sub.approvedAt).toLocaleDateString()}</span>
                                                </td>
                                            )}
                                            {activeTab === 'rejected' && (
                                                <td className="px-6 py-4 text-sm text-rich-espresso/80">
                                                    {sub.rejectedBy}<br/>
                                                    <span className="text-xs text-rich-espresso/50">{sub.rejectedAt && new Date(sub.rejectedAt).toLocaleDateString()}</span>
                                                </td>
                                            )}

                                            {(activeTab === 'pending' || activeTab === 'all') && (
                                                <td className="px-6 py-4 text-right">
                                                    {sub.status === 'pending' && (
                                                        <div className="flex justify-end gap-2">
                                                            <button 
                                                                onClick={() => handleReject(sub.id)}
                                                                className="flex items-center justify-center gap-1 rounded bg-charcoal px-3 py-1.5 text-xs font-bold text-white hover:opacity-90 transition-opacity"
                                                            >
                                                                Reject
                                                            </button>
                                                            <button 
                                                                onClick={() => handleApprove(sub.id)}
                                                                className="flex items-center justify-center gap-1 rounded bg-cymbal-gold px-3 py-1.5 text-xs font-bold text-rich-espresso hover:opacity-90 transition-opacity"
                                                            >
                                                                Approve
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-rich-espresso/60">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rich-espresso/10 mb-4">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-lg font-bold font-heading text-rich-espresso">No submissions found</h3>
                                                <p className="mt-1">Filter: {activeTab}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
        </div>
    </AuthGuard>
  );
}