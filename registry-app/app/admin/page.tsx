'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
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
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [adminStatus, setAdminStatus] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'submissions'), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subs: Submission[] = [];
      snapshot.forEach((doc) => {
        subs.push({ id: doc.id, ...doc.data() } as Submission);
      });
      setSubmissions(subs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
                    <h1 className="text-4xl font-bold font-heading text-rich-espresso mb-2">Extension Approval Queue</h1>
                    <p className="text-rich-espresso/80">Review and manage incoming extension submissions.</p>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm border border-rich-espresso/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-rich-espresso/5 border-b border-rich-espresso/10">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-bold text-rich-espresso">Extension Name</th>
                                    <th className="px-6 py-4 text-sm font-bold text-rich-espresso">Submitted By</th>
                                    <th className="px-6 py-4 text-sm font-bold text-rich-espresso">Git URL</th>
                                    <th className="px-6 py-4 text-sm font-bold text-rich-espresso">Category</th>
                                    <th className="px-6 py-4 text-sm font-bold text-rich-espresso text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-rich-espresso/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-rich-espresso/60">Loading...</td>
                                    </tr>
                                ) : submissions.length > 0 ? (
                                    submissions.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-rich-espresso/5 transition-colors">
                                            <td className="px-6 py-4 font-bold text-rich-espresso">{sub.name}</td>
                                            <td className="px-6 py-4 text-rich-espresso/80 text-sm">{sub.submittedByEmail}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <a href={sub.repoUrl} target="_blank" rel="noopener noreferrer" className="text-cymbal-gold hover:underline font-medium">
                                                    {sub.repoUrl}
                                                </a>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-full bg-cymbal-gold/20 px-3 py-1 text-xs font-medium text-rich-espresso">
                                                    {sub.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleReject(sub.id)}
                                                        className="flex items-center justify-center gap-1 rounded bg-charcoal px-3 py-1.5 text-xs font-bold text-white hover:opacity-90 transition-opacity"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                                                            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                                                        </svg>
                                                        Reject
                                                    </button>
                                                    <button 
                                                        onClick={() => handleApprove(sub.id)}
                                                        className="flex items-center justify-center gap-1 rounded bg-cymbal-gold px-3 py-1.5 text-xs font-bold text-rich-espresso hover:opacity-90 transition-opacity"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                                        </svg>
                                                        Approve
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-rich-espresso/60">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rich-espresso/10 mb-4">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-lg font-bold font-heading text-rich-espresso">All caught up!</h3>
                                                <p className="mt-1">There are no pending submissions in the queue.</p>
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
