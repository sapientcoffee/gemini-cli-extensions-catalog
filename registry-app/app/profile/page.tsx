'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import AuthGuard from '../../components/AuthGuard';
import Header from '../../components/Header';
import { resubmitExtensionAction } from '../actions';

interface Submission {
  id: string;
  name: string;
  repoUrl: string;
  category: string;
  status: string;
  statusMessage?: string;
  submittedAt: any;
  imageUrl?: string;
}

export default function ProfilePage() {
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
        console.error("Error fetching submissions:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleResubmit = async (id: string) => {
    try {
        const token = await user?.getIdToken();
        if (!token) return;
        await resubmitExtensionAction(token, id);
        alert("Extension resubmitted for review.");
    } catch (error) {
        console.error(error);
        alert("Error resubmitting.");
    }
  };

  const published = submissions.filter(s => s.status === 'approved');
  const pending = submissions.filter(s => s.status !== 'approved');

  return (
    <AuthGuard>
        <div className="min-h-screen flex flex-col bg-warm-crema">
            <Header />

            <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-12 bg-white p-8 rounded-xl shadow-sm border border-rich-espresso/5">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-warm-crema shadow-inner">
                        {user?.photoURL ? (
                            <Image src={user.photoURL} alt="User" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-coffee-accent flex items-center justify-center text-3xl font-bold text-white">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl font-bold font-heading text-rich-espresso">{user?.displayName || 'Cymbal Developer'}</h1>
                        <p className="text-rich-espresso/60">{user?.email}</p>
                        <div className="flex gap-4 mt-4 justify-center md:justify-start">
                            <div className="text-center px-4 py-2 bg-warm-crema/50 rounded-lg">
                                <span className="block text-2xl font-bold text-coffee-accent">{published.length}</span>
                                <span className="text-xs text-rich-espresso/60 uppercase tracking-wide">Published</span>
                            </div>
                            <div className="text-center px-4 py-2 bg-warm-crema/50 rounded-lg">
                                <span className="block text-2xl font-bold text-rich-espresso">{pending.length}</span>
                                <span className="text-xs text-rich-espresso/60 uppercase tracking-wide">Pending</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Published Extensions */}
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-rich-espresso font-heading mb-6 border-b border-rich-espresso/10 pb-2">My Published Extensions</h2>
                    {published.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {published.map(sub => (
                                <Link key={sub.id} href={`/extensions/${sub.id}`} className="block group">
                                    <div className="bg-white rounded-lg p-4 border border-rich-espresso/10 hover:border-coffee-accent hover:shadow-md transition-all h-full flex flex-col">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-100">
                                                {sub.imageUrl && <Image src={sub.imageUrl} alt={sub.name} fill className="object-cover" />}
                                            </div>
                                            <h3 className="font-bold text-rich-espresso group-hover:text-coffee-accent transition-colors line-clamp-1">{sub.name}</h3>
                                        </div>
                                        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                                            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">LIVE</span>
                                            <span className="text-rich-espresso/50 capitalize">{sub.category}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-rich-espresso/60 italic">No published extensions yet.</p>
                    )}
                </div>

                {/* Submission Queue */}
                <div>
                    <h2 className="text-xl font-bold text-rich-espresso font-heading mb-6 border-b border-rich-espresso/10 pb-2">Submission Queue</h2>
                    <div className="bg-white rounded-lg shadow-sm border border-rich-espresso/5 overflow-hidden">
                        {pending.length > 0 ? (
                            <table className="w-full text-left">
                                <thead className="bg-rich-espresso/5">
                                    <tr>
                                        <th className="px-6 py-3 text-sm font-bold text-rich-espresso">Name</th>
                                        <th className="px-6 py-3 text-sm font-bold text-rich-espresso">Status</th>
                                        <th className="px-6 py-3 text-sm font-bold text-rich-espresso">Message</th>
                                        <th className="px-6 py-3 text-sm font-bold text-rich-espresso">Date</th>
                                        <th className="px-6 py-3 text-sm font-bold text-rich-espresso">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-rich-espresso/5">
                                    {pending.map(sub => (
                                        <tr key={sub.id} className="hover:bg-rich-espresso/5 transition-colors">
                                            <td className="px-6 py-4 font-bold text-rich-espresso">{sub.name || 'Untitled'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize
                                                    ${sub.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-rich-espresso/70">{sub.statusMessage || '-'}</td>
                                            <td className="px-6 py-4 text-sm text-rich-espresso/50">
                                                {sub.submittedAt?.toDate().toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {sub.status === 'rejected' && (
                                                    <button 
                                                        onClick={() => handleResubmit(sub.id)}
                                                        className="text-coffee-accent font-bold hover:underline"
                                                    >
                                                        Resubmit
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-8 text-center">
                                <p className="text-rich-espresso/60 mb-4">No pending submissions.</p>
                                <Link href="/submit" className="text-coffee-accent font-bold hover:underline">Submit a new extension</Link>
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    </AuthGuard>
  );
}
