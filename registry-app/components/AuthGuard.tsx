/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthGuard({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
    const { user, loading, isAdmin, signInWithGoogle } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            // Optional: Redirect to home or stay on page and show login prompt
            // router.push('/'); 
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-warm-crema">
                 <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-10 w-10 text-rich-espresso" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-rich-espresso font-bold">Brewing...</p>
                 </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-warm-crema p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center border border-rich-espresso/5">
                    <div className="h-16 w-16 bg-rich-espresso/10 rounded-full flex items-center justify-center mx-auto mb-6">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-rich-espresso">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold font-heading text-rich-espresso mb-2">Authentication Required</h2>
                    <p className="text-rich-espresso/70 mb-8">Please sign in with your Cymbal Coffee account to access this page.</p>
                    <button 
                        onClick={() => signInWithGoogle()}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-rich-espresso font-bold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        Sign in with Google
                    </button>
                </div>
            </div>
        );
    }

    if (adminOnly && !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-warm-crema">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg border border-red-200">
                    <h2 className="text-2xl font-bold text-red-800 mb-2">Access Denied</h2>
                    <p className="text-rich-espresso/70">You do not have permission to view this page.</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
