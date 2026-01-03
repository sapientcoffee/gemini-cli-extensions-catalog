/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import Link from 'next/link';

export default function SignOutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-crema p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center border border-rich-espresso/5">
            <div className="h-16 w-16 bg-rich-espresso/10 rounded-full flex items-center justify-center mx-auto mb-6">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-rich-espresso">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold font-heading text-rich-espresso mb-2">Signed Out</h2>
            <p className="text-rich-espresso/70 mb-8">You have successfully signed out of your account.</p>
            
            <div className="flex flex-col gap-3">
                <Link 
                    href="/"
                    className="w-full inline-flex items-center justify-center gap-2 bg-cymbal-gold text-rich-espresso font-bold py-3 px-4 rounded-lg hover:brightness-105 transition-all"
                >
                    Return to Registry
                </Link>
            </div>
        </div>
    </div>
  );
}
