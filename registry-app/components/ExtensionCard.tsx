/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import Image from 'next/image';
import { Extension } from '../lib/types';
import Link from 'next/link';

interface ExtensionCardProps {
  extension: Extension;
}

export default function ExtensionCard({ extension }: ExtensionCardProps) {
  return (
    <Link href={`/extensions/${extension.id}`} className="block h-full group">
      <div className="flex flex-col gap-4 rounded-lg bg-coffee-surface p-4 h-full border border-coffee-highlight transition-all duration-200 hover:border-coffee-accent/50 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-1">
        
        {/* Image Container */}
        <div className="w-full relative aspect-square rounded-md overflow-hidden bg-coffee-highlight border border-coffee-highlight/50 group-hover:border-coffee-accent/20 transition-colors">
            <Image 
                src={extension.imageUrl} 
                alt={extension.name} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Type Badge */}
            <div className="absolute top-2 right-2">
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded border shadow-sm backdrop-blur-md
                    ${extension.type === 'persona' 
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                    {extension.type}
                </span>
            </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 flex-grow">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-coffee-text text-lg font-bold group-hover:text-coffee-accent transition-colors line-clamp-1">{extension.name}</h3>
          </div>
          
          <p className="text-coffee-muted text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">{extension.description}</p>
          
          <div className="flex flex-wrap gap-2 pt-3 mt-auto border-t border-coffee-highlight/50">
            {(extension.tags || []).slice(0, 3).map(tag => (
              <span key={tag} className="text-xs font-mono text-coffee-muted/80 bg-coffee-highlight px-2 py-0.5 rounded border border-transparent hover:border-coffee-muted/30 transition-colors">
                #{tag}
              </span>
            ))}
            {(extension.tags || []).length > 3 && (
                <span className="text-xs font-mono text-coffee-muted/50 px-1 py-0.5">+{(extension.tags || []).length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}