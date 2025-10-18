
import React from 'react';
import type { BookStructure } from '../types';
import { CheckCircleIcon, DocumentIcon, SparklesIcon } from './IconComponents';

interface TableOfContentsProps {
    structure: BookStructure;
    currentView: string;
    setCurrentView: (id: string) => void;
    generatingChapters: Set<string>;
    generatedChapters: Set<string>;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ 
    structure, 
    currentView, 
    setCurrentView,
    generatingChapters,
    generatedChapters
}) => {
    return (
        <nav className="space-y-6">
            {structure.map((part) => (
                <div key={part.id}>
                    {part.id !== 'intro' && (
                        <div className="mb-3">
                            <h2 className="text-xl font-semibold text-amber-300/90">{part.title}</h2>
                            {part.description && <p className="text-sm text-stone-400 font-light">{part.description}</p>}
                        </div>
                    )}
                    <ul className="space-y-1">
                        {part.chapters.map((chapter) => {
                            const isActive = currentView === chapter.id;
                            const isGenerating = generatingChapters.has(chapter.id);
                            const isGenerated = generatedChapters.has(chapter.id) && !isGenerating;

                            return (
                                <li key={chapter.id}>
                                    <button
                                        onClick={() => setCurrentView(chapter.id)}
                                        className={`w-full text-left p-3 rounded-md transition-colors duration-200 flex items-center gap-3 ${
                                            isActive
                                                ? 'bg-amber-600/20 text-amber-200'
                                                : 'hover:bg-stone-700/50 text-stone-300'
                                        }`}
                                    >
                                        <div className="flex-shrink-0 w-5 h-5">
                                            {isGenerating ? (
                                                <SparklesIcon className="w-5 h-5 text-amber-400 animate-pulse" />
                                            ) : isGenerated ? (
                                                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                                            ) : (
                                                <DocumentIcon className="w-5 h-5 text-stone-500" />
                                            )}
                                        </div>
                                        <span className="flex-1">{chapter.title}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>
    );
};
