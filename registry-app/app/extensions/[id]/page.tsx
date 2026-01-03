'use client';

import { use, useState } from 'react';
import { mockExtensions } from '@/lib/mockData';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function ExtensionDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const extension = mockExtensions.find((ext) => ext.id === id);
  const [copied, setCopied] = useState(false);

  if (!extension) {
    notFound();
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(extension.installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-warm-crema">
      {/* Header (Simplified for sub-page) */}
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

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Hero & Content */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Hero Section */}
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden shadow-lg border-2 border-white">
                        <Image 
                            src={extension.imageUrl} 
                            alt={extension.name} 
                            fill 
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-rich-espresso font-heading mb-2">{extension.name}</h1>
                        <p className="text-lg text-rich-espresso/80">{extension.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                             {extension.tags.map(tag => (
                                <span key={tag} className="text-sm font-medium bg-cymbal-gold/20 text-rich-espresso px-3 py-1 rounded-full">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Readme Content */}
                <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-rich-espresso/5">
                    <h2 className="text-2xl font-bold text-rich-espresso font-heading mb-6 border-b border-rich-espresso/10 pb-2">Documentation</h2>
                    <article className="prose prose-stone prose-headings:font-heading prose-headings:text-rich-espresso prose-p:text-rich-espresso/80 prose-a:text-cymbal-gold hover:prose-a:text-rich-espresso max-w-none">
                        {/* We are simulating Markdown rendering by preserving whitespace for now */}
                        <pre className="font-sans whitespace-pre-wrap">{extension.readme}</pre>
                    </article>
                </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="space-y-6">
                
                {/* Install Box */}
                <div className="bg-rich-espresso text-warm-crema rounded-lg p-6 shadow-lg">
                    <h3 className="text-lg font-bold mb-3 text-cymbal-gold">Install Extension</h3>
                    <div className="bg-black/30 rounded p-3 font-mono text-sm mb-4 break-all border border-white/10">
                        {extension.installCommand}
                    </div>
                    <button 
                        onClick={handleCopy}
                        className="w-full flex items-center justify-center gap-2 bg-cymbal-gold text-rich-espresso font-bold py-2 px-4 rounded hover:bg-white transition-colors"
                    >
                        {copied ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 0 1 1.04-.208Z" clipRule="evenodd" />
                                </svg>
                                Copied!
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                                </svg>
                                Copy Command
                            </>
                        )}
                    </button>
                </div>

                {/* Metadata */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-rich-espresso/5">
                    <h3 className="text-lg font-bold font-heading mb-4 text-rich-espresso">Details</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-rich-espresso/60">Version</p>
                            <p className="font-medium text-rich-espresso">{extension.version}</p>
                        </div>
                        <div>
                            <p className="text-sm text-rich-espresso/60">Author</p>
                            <p className="font-medium text-rich-espresso">{extension.author}</p>
                        </div>
                         <div>
                            <p className="text-sm text-rich-espresso/60">Type</p>
                            <p className="font-medium text-rich-espresso capitalize">{extension.type}</p>
                        </div>
                        <div>
                            <p className="text-sm text-rich-espresso/60">Last Updated</p>
                            <p className="font-medium text-rich-espresso">Dec 22, 2025</p>
                        </div>
                    </div>
                </div>

                 {/* Support / Help */}
                 <div className="bg-white rounded-lg p-6 shadow-sm border border-rich-espresso/5">
                    <h3 className="text-lg font-bold font-heading mb-2 text-rich-espresso">Need Help?</h3>
                    <p className="text-sm text-rich-espresso/80 mb-4">
                        Issues with this extension? Contact the author or raise a ticket.
                    </p>
                    <button className="text-sm font-bold text-rich-espresso hover:text-cymbal-gold underline decoration-cymbal-gold underline-offset-4">
                        Report Issue
                    </button>
                </div>

            </div>
        </div>
      </main>
    </div>
  );
}
