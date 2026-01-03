'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import AuthGuard from '../../components/AuthGuard';
import Header from '../../components/Header';

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    name: '',
    repoUrl: '',
    category: 'Persona',
    description: '',
    tags: '',
    imageUrl: ''
  });
  const [availableTools, setAvailableTools] = useState<{id: string, name: string}[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const q = query(collection(db, 'registry'), where('type', '==', 'tool'));
        const snapshot = await getDocs(q);
        const tools = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name || 'Unknown Tool' }));
        setAvailableTools(tools);
      } catch (error) {
        console.error("Error fetching tools:", error);
      }
    };
    fetchTools();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
        if (!auth.currentUser) {
            throw new Error('User must be logged in to submit.');
        }

        const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
        const isPersona = formData.category === 'Persona';
        
        await addDoc(collection(db, 'submissions'), {
            name: formData.name,
            repoUrl: formData.repoUrl,
            category: formData.category.toLowerCase(), // 'persona' | 'tool'
            description: formData.description,
            tags: tagsArray,
            imageUrl: formData.imageUrl || '/file.svg', // Default placeholder
            associatedTools: isPersona ? selectedTools : [],
            submittedBy: auth.currentUser.uid,
            submittedByEmail: auth.currentUser.email,
            submittedAt: serverTimestamp(),
            status: 'pending'
        });

        setSubmitStatus('success');
        setFormData({
            name: '',
            repoUrl: '',
            category: 'Persona',
            description: '',
            tags: '',
            imageUrl: ''
        });
        setSelectedTools([]);
    } catch (error) {
        console.error("Error submitting extension:", error);
        setSubmitStatus('error');
    } finally {
        setIsSubmitting(false);
    }
  };

  const toggleTool = (toolId: string) => {
    setSelectedTools(prev => 
      prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId]
    );
  };

  return (
    <AuthGuard>
        <div className="min-h-screen flex flex-col bg-warm-crema">
        <Header />

        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">
                {/* Page Heading */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold font-heading text-rich-espresso mb-2">Submit a New Extension</h1>
                    <p className="text-rich-espresso/80">Add your new Gemini extension to the internal registry.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-sm border border-rich-espresso/5">
                    
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-base font-bold text-rich-espresso mb-2">Extension Name</label>
                        <input 
                            id="name"
                            type="text" 
                            required
                            className="w-full h-14 rounded-lg border border-rich-espresso/20 px-4 text-rich-espresso focus:outline-none focus:ring-2 focus:ring-cymbal-gold bg-warm-crema/20"
                            placeholder="e.g., Code Reviewer"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    {/* Git URL */}
                    <div>
                        <label htmlFor="repoUrl" className="block text-base font-bold text-rich-espresso mb-2">Git Repository URL</label>
                        <input 
                            id="repoUrl"
                            type="url" 
                            required
                            className="w-full h-14 rounded-lg border border-rich-espresso/20 px-4 text-rich-espresso focus:outline-none focus:ring-2 focus:ring-cymbal-gold bg-warm-crema/20"
                            placeholder="e.g., https://github.com/cymbal-coffee/my-extension"
                            value={formData.repoUrl}
                            onChange={(e) => setFormData({...formData, repoUrl: e.target.value})}
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <span className="block text-base font-bold text-rich-espresso mb-2">Category</span>
                        <div className="flex flex-wrap gap-4">
                            {['Persona', 'Tool'].map((cat) => (
                                <label 
                                    key={cat}
                                    className={`flex items-center justify-center px-6 h-12 rounded-lg border cursor-pointer transition-all font-medium ${
                                        formData.category === cat 
                                        ? 'border-cymbal-gold bg-cymbal-gold/10 text-rich-espresso ring-1 ring-cymbal-gold' 
                                        : 'border-rich-espresso/20 text-rich-espresso/60 hover:border-rich-espresso/40'
                                    }`}
                                >
                                    <input 
                                        type="radio" 
                                        name="category" 
                                        value={cat}
                                        checked={formData.category === cat}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className="sr-only"
                                    />
                                    {cat}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Associated Tools (Only for Personas) */}
                    {formData.category === 'Persona' && availableTools.length > 0 && (
                        <div>
                            <span className="block text-base font-bold text-rich-espresso mb-2">Associated Tools</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-warm-crema/20 p-4 rounded-lg border border-rich-espresso/10 max-h-60 overflow-y-auto">
                                {availableTools.map((tool) => (
                                    <label key={tool.id} className="flex items-center gap-3 p-2 rounded hover:bg-white cursor-pointer transition-colors">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                            selectedTools.includes(tool.id) 
                                            ? 'bg-cymbal-gold border-cymbal-gold text-rich-espresso' 
                                            : 'border-rich-espresso/30 bg-white'
                                        }`}>
                                            {selectedTools.includes(tool.id) && (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-3.5">
                                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <input 
                                            type="checkbox"
                                            className="sr-only"
                                            checked={selectedTools.includes(tool.id)}
                                            onChange={() => toggleTool(tool.id)}
                                        />
                                        <span className="text-sm font-medium text-rich-espresso/80">{tool.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-base font-bold text-rich-espresso mb-2">Description</label>
                        <textarea 
                            id="description"
                            required
                            rows={5}
                            className="w-full rounded-lg border border-rich-espresso/20 p-4 text-rich-espresso focus:outline-none focus:ring-2 focus:ring-cymbal-gold bg-warm-crema/20 resize-y min-h-[144px]"
                            placeholder="Provide a brief summary of what your extension does..."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label htmlFor="tags" className="block text-base font-bold text-rich-espresso mb-2">Tags <span className="text-sm font-normal text-rich-espresso/50">(comma separated)</span></label>
                        <input 
                            id="tags"
                            type="text" 
                            className="w-full h-14 rounded-lg border border-rich-espresso/20 px-4 text-rich-espresso focus:outline-none focus:ring-2 focus:ring-cymbal-gold bg-warm-crema/20"
                            placeholder="e.g., productivity, linter, fun"
                            value={formData.tags}
                            onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        />
                    </div>

                     {/* Image URL */}
                     <div>
                        <label htmlFor="imageUrl" className="block text-base font-bold text-rich-espresso mb-2">Image URL <span className="text-sm font-normal text-rich-espresso/50">(optional)</span></label>
                        <input 
                            id="imageUrl"
                            type="url" 
                            className="w-full h-14 rounded-lg border border-rich-espresso/20 px-4 text-rich-espresso focus:outline-none focus:ring-2 focus:ring-cymbal-gold bg-warm-crema/20"
                            placeholder="e.g., https://example.com/icon.png"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full h-12 bg-cymbal-gold text-rich-espresso font-bold rounded-lg hover:brightness-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-rich-espresso" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : 'Submit for Review'}
                        </button>
                    </div>

                    {/* Status Messages */}
                    {submitStatus === 'success' && (
                        <div className="bg-green-100 border border-green-200 text-green-800 p-4 rounded-lg flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                            </svg>
                            <p className="font-medium">Success! Your extension has been submitted for approval.</p>
                        </div>
                    )}
                </form>
            </div>
        </main>
        </div>
    </AuthGuard>
  );
}