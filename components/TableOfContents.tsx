
import React from 'react';
import type { BookStructure } from '../types';
import { CheckCircleIcon, DocumentIcon, SparklesIcon } from './IconComponents';

interface TableOfContentsProps {
    structure: BookStructure;
    currentView: string;
    setCurrentView: (id: string) => void;
    generatingChapters: Set<string>;
    generatedChapters: Set<string>;
    prefilledChapterIds: Set<string>;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ 
    structure, 
    currentView, 
    setCurrentView,
    generatingChapters,
    generatedChapters,
    prefilledChapterIds
}) => {
    const currentChapter = structure
        .flatMap(part => part.chapters)
        .find(chapter => chapter.id === currentView);
        
    return (
        <>
            <nav className="space-y-6">
                {structure.map((part) => (
                    <div key={part.id}>
                        {part.id !== 'intro' && (
                            <div className="mb-3">
                                <h2 className="text-lg font-semibold text-amber-200 bg-stone-700/40 px-3 py-2 rounded-md border-l-4 border-l-amber-500/50">{part.title}</h2>
                                {part.description && <p className="text-sm text-stone-400 font-light mt-1 px-3">{part.description}</p>}
                            </div>
                        )}
                        <ul className="space-y-1 pl-2">
                            {part.chapters.map((chapter) => {
                                const isActive = currentView === chapter.id;
                                const isGenerating = generatingChapters.has(chapter.id);
                                const isGenerated = generatedChapters.has(chapter.id) && !isGenerating;
                                const isPrefilled = prefilledChapterIds.has(chapter.id);
                                const isAiGeneratedAndNotPrefilled = isGenerated && !isPrefilled;

                                let buttonClasses = 'w-full text-left p-3 rounded-md transition-all duration-200 flex items-center gap-3 border-l-4 ';

                                if (isActive) {
                                    buttonClasses += 'bg-amber-600/20 text-amber-200 border-amber-500';
                                } else {
                                    buttonClasses += 'hover:bg-stone-700/50 text-stone-300 hover:border-stone-600 ';
                                    if (isAiGeneratedAndNotPrefilled) {
                                        buttonClasses += 'bg-stone-900/30 border-stone-700';
                                    } else {
                                        buttonClasses += 'border-transparent';
                                    }
                                }

                                return (
                                    <li key={chapter.id}>
                                        <button
                                            onClick={() => setCurrentView(chapter.id)}
                                            className={buttonClasses}
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
            {currentChapter && (
                <div key={currentChapter.id} className="mt-8 pt-6 border-t border-stone-700/50 animate-content-fade-in">
                    <h3 className="text-lg font-semibold text-amber-300/90 mb-3">Resumen del Capítulo</h3>
                    <div className="bg-stone-800/70 p-4 rounded-lg border border-stone-700">
                        <h4 className="font-bold text-stone-100">{currentChapter.title}</h4>
                        <p className="text-sm text-stone-400 font-light mt-2 italic">
                            {currentChapter.synopsis}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};
