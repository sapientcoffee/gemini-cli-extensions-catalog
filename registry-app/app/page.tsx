'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ExtensionCard from '../components/ExtensionCard';
import { Extension, ExtensionType } from '../lib/types';
import Link from 'next/link';

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
                          ext.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = activeFilter === 'all' || ext.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-coffee-dark text-coffee-text">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-coffee-highlight py-4 px-4 sm:px-6 lg:px-8 bg-coffee-surface sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <div className="size-8 text-coffee-accent">
                   {/* Logo SVG */}
                   <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fill="currentColor" fillRule="evenodd"></path>
                    </svg>
                </div>
                <h1 className="text-coffee-text text-lg font-bold tracking-tight">Cymbal Registry</h1>
            </div>
            {/* Nav placeholder */}
            <nav className="flex gap-4 items-center text-sm font-medium">
                <Link href="/admin" className="text-coffee-muted hover:text-coffee-accent transition-colors">Admin</Link>
                <Link href="/submit" className="bg-coffee-accent text-coffee-dark px-4 py-1.5 rounded-md hover:bg-white transition-colors">Submit</Link>
            </nav>
        </header>

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