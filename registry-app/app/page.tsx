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
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ExtensionCard from '../components/ExtensionCard';
import { Extension, ExtensionType } from '../lib/types';
import Link from 'next/link';
import Header from '../components/Header';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | ExtensionType>('all');
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExtensions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'registry'));
        const fetchedExtensions: Extension[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Extension));
        setExtensions(fetchedExtensions);
      } catch (error) {
        console.error("Error fetching extensions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExtensions();
  }, []);

  const filteredExtensions = extensions.filter(ext => {
    const matchesSearch = ext.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (ext.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = activeFilter === 'all' || ext.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-coffee-dark text-coffee-text">
        <Header />

        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-coffee-highlight bg-coffee-surface/50">
            <div className="absolute inset-0 bg-[radial-gradient(#292524_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-coffee-text mb-6">
                        Brewing Innovation. <span className="text-coffee-accent">Served Hot.</span>
                    </h2>
                    <p className="text-xl text-coffee-muted mb-10 leading-relaxed">
                        The official extension registry for the Cymbal Coffee developer ecosystem. 
                        Discover personas, tools, and utilities to supercharge your Gemini CLI workflow.
                    </p>
                    
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-black/40 backdrop-blur-sm p-2 pr-6 rounded-lg border border-coffee-highlight mx-auto">
                        <div className="flex gap-1.5 px-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                        </div>
                        <code className="font-mono text-sm sm:text-base text-coffee-accent">
                            gemini install <span className="text-coffee-muted">&lt;extension-name&gt;</span>
                        </code>
                        <div className="hidden sm:block w-px h-6 bg-coffee-highlight mx-2"></div>
                        <span className="text-xs text-coffee-muted font-mono uppercase tracking-widest hidden sm:block">Copy to clipboard</span>
                    </div>
                </div>
            </div>
        </section>

        {/* Important Notice */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 text-coffee-text">
                <h3 className="text-lg font-bold text-yellow-600 mb-4">Important: Private Repository Access</h3>
                
                <div className="space-y-6">
                    {/* GitHub Section */}
                    <div>
                        <h4 className="font-bold text-rich-espresso mb-2">GitHub Private Repositories</h4>
                        <p className="text-sm mb-2 leading-relaxed">
                            If you are installing from a private GitHub repository, you must set the <code className="bg-black/20 px-1 py-0.5 rounded text-yellow-500">GITHUB_TOKEN</code> environment variable.
                        </p>
                        <div className="bg-black/20 rounded p-4 mb-2 text-sm font-mono overflow-x-auto">
                            <p className="text-coffee-muted mb-2"># 1. Generate a PAT with &apos;repo&apos; scope at <a href="https://github.com/settings/tokens" target="_blank" className="text-blue-400 hover:underline">github.com/settings/tokens</a></p>
                            <p className="text-coffee-muted mb-2"># 2. Set the variable:</p>
                            <p className="text-green-400">export GITHUB_TOKEN=your_token_here</p>
                        </div>
                        <p className="text-xs text-coffee-muted">
                            See <a href="https://github.com/google-gemini/gemini-cli/issues/11996" target="_blank" className="text-coffee-accent hover:underline">Issue #11996</a> for security details.
                        </p>
                    </div>


                </div>
            </div>
        </div>

        <main className="flex-grow flex flex-col gap-8 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                {/* Search */}
                <div className="w-full md:max-w-md relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-coffee-muted group-focus-within:text-coffee-accent transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </div>
                    <input 
                        className="block w-full rounded-md border-0 bg-coffee-highlight py-2.5 pl-10 pr-4 text-coffee-text placeholder:text-coffee-muted focus:ring-2 focus:ring-coffee-accent sm:text-sm sm:leading-6 transition-all"
                        placeholder="Search extensions..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    <button 
                        onClick={() => setActiveFilter('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeFilter === 'all' ? 'bg-coffee-accent text-coffee-dark font-bold' : 'text-coffee-muted hover:text-coffee-text hover:bg-coffee-highlight'}`}
                    >
                        All
                    </button>
                    <button 
                        onClick={() => setActiveFilter('persona')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeFilter === 'persona' ? 'bg-coffee-accent text-coffee-dark font-bold' : 'text-coffee-muted hover:text-coffee-text hover:bg-coffee-highlight'}`}
                    >
                        Personas
                    </button>
                    <button 
                        onClick={() => setActiveFilter('tool')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeFilter === 'tool' ? 'bg-coffee-accent text-coffee-dark font-bold' : 'text-coffee-muted hover:text-coffee-text hover:bg-coffee-highlight'}`}
                    >
                        Tools
                    </button>
                </div>
            </div>

            {/* Loading / Grid */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-coffee-accent"></div>
                    <p className="mt-2 text-coffee-muted">Loading registry...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
                        {filteredExtensions.map(ext => (
                            <ExtensionCard key={ext.id} extension={ext} />
                        ))}
                    </div>
                    
                    {filteredExtensions.length === 0 && (
                        <div className="text-center py-20 border border-dashed border-coffee-highlight rounded-xl">
                            <p className="text-lg font-medium text-coffee-muted">No extensions found matching your criteria.</p>
                        </div>
                    )}
                </>
            )}
        </main>
    </div>
  );
}