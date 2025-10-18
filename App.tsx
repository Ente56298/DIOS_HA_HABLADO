import React, { useState, useCallback } from 'react';
import { TableOfContents } from './components/TableOfContents';
import { ChapterView } from './components/ChapterView';
import { generateChapterContent } from './services/geminiService';
import { BOOK_STRUCTURE } from './constants';
import type { BookContent, Chapter } from './types';
import { BookIcon, InfoIcon } from './components/IconComponents';
import { ResearchReportModal } from './components/ResearchReportModal';

const App: React.FC = () => {
    const [bookContent, setBookContent] = useState<BookContent>({});
    const [generatingChapters, setGeneratingChapters] = useState<Set<string>>(new Set());
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [isReportVisible, setIsReportVisible] = useState<boolean>(false);
    
    const initialView = BOOK_STRUCTURE.find(part => part.chapters.length > 0)?.chapters[0]?.id || 'intro';
    const [currentView, setCurrentView] = useState<string>(initialView);

    const handleGenerateChapter = useCallback(async (chapter: Chapter) => {
        setGeneratingChapters(prev => new Set(prev).add(chapter.id));
        try {
            const content = await generateChapterContent(chapter.title, chapter.synopsis);
            setBookContent(prev => ({ ...prev, [chapter.id]: content }));
        } catch (error) {
            console.error(`Failed to generate content for ${chapter.title}:`, error);
            setBookContent(prev => ({ ...prev, [chapter.id]: `<p class="text-red-400">Error al generar este capítulo. Por favor, inténtelo de nuevo.</p>` }));
        } finally {
            setGeneratingChapters(prev => {
                const newSet = new Set(prev);
                newSet.delete(chapter.id);
                return newSet;
            });
        }
    }, []);

    const handleGenerateBook = useCallback(async () => {
        setIsGenerating(true);
        const allChapters: Chapter[] = BOOK_STRUCTURE.flatMap(part => part.chapters);
        
        await Promise.all(allChapters.map(chapter => handleGenerateChapter(chapter)));

        setIsGenerating(false);
    }, [handleGenerateChapter]);
    
    const currentChapter = BOOK_STRUCTURE.flatMap(p => p.chapters).find(c => c.id === currentView);

    return (
        <div className="bg-stone-900 text-stone-300 min-h-screen flex flex-col">
            <header className="bg-black/20 backdrop-blur-sm border-b border-stone-700/50 p-4 shadow-lg flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <BookIcon className="w-8 h-8 text-amber-300" />
                    <div>
                        <h1 className="text-2xl font-bold text-stone-100 tracking-wider">Y Dios Ha Hablado</h1>
                        <p className="text-sm text-stone-400">Revelación, Palabra y Respuesta</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsReportVisible(true)}
                        className="p-2 rounded-full hover:bg-stone-700/60 transition-colors duration-200"
                        aria-label="Mostrar informe de investigación"
                        title="Informe de Investigación"
                    >
                        <InfoIcon className="w-6 h-6 text-stone-300" />
                    </button>
                    <button
                        onClick={handleGenerateBook}
                        disabled={isGenerating}
                        className="bg-amber-600 text-white font-semibold py-2 px-6 rounded-md shadow-md hover:bg-amber-500 transition-all duration-300 disabled:bg-stone-600 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generando Libro...
                            </>
                        ) : (
                            'Generar Libro Completo'
                        )}
                    </button>
                </div>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <aside className="w-1/3 max-w-sm bg-stone-800/50 border-r border-stone-700/50 overflow-y-auto p-4">
                    <TableOfContents 
                        structure={BOOK_STRUCTURE} 
                        currentView={currentView} 
                        setCurrentView={setCurrentView}
                        generatingChapters={generatingChapters}
                        generatedChapters={new Set(Object.keys(bookContent))}
                    />
                </aside>
                <main className="flex-1 overflow-y-auto p-8 md:p-12">
                   {currentChapter && (
                       <ChapterView
                           chapter={currentChapter}
                           content={bookContent[currentView]}
                           isGenerating={generatingChapters.has(currentView)}
                           generateChapter={() => handleGenerateChapter(currentChapter)}
                       />
                   )}
                </main>
            </div>
            <ResearchReportModal 
                isOpen={isReportVisible} 
                onClose={() => setIsReportVisible(false)} 
            />
        </div>
    );
};

export default App;