'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import AuthGuard from '../../components/AuthGuard';

interface Submission {
  id: string;
  name: string;
  repoUrl: string;
  category: string;
  status: string;
  statusMessage?: string;
  submittedAt: any;
}

export default function MyRequestsPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
        collection(db, 'submissions'), 
        where('submittedBy', '==', user.uid),
        orderBy('submittedAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subs: Submission[] = [];
      snapshot.forEach((doc) => {
        subs.push({ id: doc.id, ...doc.data() } as Submission);
      });
      setSubmissions(subs);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching my requests:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <AuthGuard>
        <div className="min-h-screen flex flex-col bg-warm-crema">
        {/* Header */}
        <header className="border-b border-rich-espresso/10 bg-warm-crema py-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-rich-espresso hover:opacity-80 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    <span className="font-bold">Back to Registry</span>
                </Link>
            </div>
        </header>

        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Page Heading */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold font-heading text-rich-espresso mb-2">My Extension Requests</h1>
                    <p className="text-rich-espresso/80">Track the status of your submitted extensions.</p>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm border border-rich-espresso/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-rich-espresso/5 border-b border-rich-espresso/10">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-bold text-rich-espresso">Extension Name</th>
                                    <th className="px-6 py-4 text-sm font-bold text-rich-espresso">Git URL</th>
                                    <th className="px-6 py-4 text-sm font-bold text-rich-espresso">Category</th>
                                    <th className="px-6 py-4 text-sm font-bold text-rich-espresso">Status</th>
                                    <th className="px-6 py-4 text-sm font-bold text-rich-espresso">Message</th>
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
                                            <td className="px-6 py-4 font-bold text-rich-espresso">{sub.name || '(No Name)'}</td>
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
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold
                                                    ${sub.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                                      sub.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                                      sub.status === 'error' ? 'bg-red-100 text-red-800' :
                                                      'bg-yellow-100 text-yellow-800'}`}>
                                                    {sub.status ? sub.status.toUpperCase() : 'PENDING'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-rich-espresso/70">
                                                {sub.statusMessage}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-rich-espresso/60">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rich-espresso/10 mb-4">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-lg font-bold font-heading text-rich-espresso">No requests found</h3>
                                                <p className="mt-1 mb-4">You haven't submitted any extensions yet.</p>
                                                <Link href="/submit" className="bg-cymbal-gold text-rich-espresso px-4 py-2 rounded-md font-bold hover:brightness-105 transition-all">
                                                    Submit Extension
                                                </Link>
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
