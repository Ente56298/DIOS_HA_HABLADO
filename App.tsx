import React, { useState, useCallback, useMemo } from 'react';
import { TableOfContents } from './components/TableOfContents';
import { ChapterView } from './components/ChapterView';
import { generateChapterContent } from './services/geminiService';
import { BOOK_STRUCTURE } from './constants';
import { CHAPTER_1_CONTENT, CHAPTER_1_2_CONTENT } from './prefilledContent';
import type { BookContent, Chapter } from './types';
import { BookIcon, InfoIcon, TrashIcon, SearchIcon } from './components/IconComponents';
import { ResearchReportModal } from './components/ResearchReportModal';

const initialBookContent: BookContent = {
    'chap-1-1': CHAPTER_1_CONTENT,
    'chap-1-2': CHAPTER_1_2_CONTENT,
};

interface SearchResult {
    chapterId: string;
    chapterTitle: string;
    snippet: string;
}

const App: React.FC = () => {
    const [bookContent, setBookContent] = useState<BookContent>(initialBookContent);
    const [generatingChapters, setGeneratingChapters] = useState<Set<string>>(new Set());
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [isReportVisible, setIsReportVisible] = useState<boolean>(false);
    
    const initialView = 'chap-1-2';
    const [currentView, setCurrentView] = useState<string>(initialView);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

    const allChapters = useMemo(() => BOOK_STRUCTURE.flatMap(part => part.chapters), []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length < 3) {
            setSearchResults([]);
            return;
        }

        const results: SearchResult[] = [];
        
        for (const chapter of allChapters) {
            const content = bookContent[chapter.id];
            if (content) {
                const plainText = content.replace(/<[^>]+>/g, ' ');
                const matchIndex = plainText.toLowerCase().indexOf(query.toLowerCase());

                if (matchIndex !== -1) {
                    const snippetStart = Math.max(0, matchIndex - 50);
                    const snippetEnd = Math.min(plainText.length, matchIndex + query.length + 80);
                    let snippet = plainText.substring(snippetStart, snippetEnd);
                    
                    if (snippetStart > 0) snippet = '...' + snippet;
                    if (snippetEnd < plainText.length) snippet = snippet + '...';

                    snippet = snippet.replace(new RegExp(`(${query})`, 'gi'), '<mark class="bg-amber-400 text-black px-1 rounded-sm">$1</mark>');

                    results.push({
                        chapterId: chapter.id,
                        chapterTitle: chapter.title,
                        snippet: snippet
                    });
                }
            }
        }
        setSearchResults(results);
    };

    const handleResultClick = (chapterId: string) => {
        setCurrentView(chapterId);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleGenerateChapter = useCallback(async (chapter: Chapter) => {
        setGeneratingChapters(prev => new Set(prev).add(chapter.id));
        try {
            const content = await generateChapterContent(chapter.title, chapter.synopsis, chapter.audioUrl, chapter.videoUrl);
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
        const chaptersToGenerate = allChapters.filter(c => !bookContent[c.id]);
        await Promise.all(chaptersToGenerate.map(chapter => handleGenerateChapter(chapter)));
        setIsGenerating(false);
    }, [handleGenerateChapter, bookContent, allChapters]);

    const handleClearChapter = useCallback((chapterId: string) => {
        if (window.confirm('¿Está seguro de que desea borrar el contenido de este capítulo? Podrá generarlo de nuevo.')) {
            setBookContent(prev => {
                const newContent = { ...prev };
                delete newContent[chapterId];
                return newContent;
            });
        }
    }, []);

    const handleClearAll = useCallback(() => {
        if (window.confirm('¿Está seguro de que desea borrar TODO el contenido generado? Esta acción restablecerá el libro a su estado inicial.')) {
            setBookContent(initialBookContent);
        }
    }, []);
    
    const currentChapter = allChapters.find(c => c.id === currentView);

    return (
        <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-stone-300 min-h-screen flex flex-col">
            <header className="bg-black/20 backdrop-blur-sm border-b border-stone-700/50 p-4 shadow-lg flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <BookIcon className="w-8 h-8 text-amber-300" />
                    <div>
                        <h1 className="text-2xl font-bold text-stone-100 tracking-wider">Y Dios Ha Hablado</h1>
                        <p className="text-sm text-stone-400">Revelación, Palabra y Respuesta</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Buscar en el libro..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="bg-stone-800 border border-stone-700 rounded-md py-2 pl-10 pr-4 text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 w-64 transition-all"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <SearchIcon className="w-5 h-5 text-stone-400" />
                            </div>
                        </div>
                        {searchResults.length > 0 && (
                            <div className="absolute top-full mt-2 w-96 max-h-96 overflow-y-auto bg-stone-800 border border-stone-700 rounded-md shadow-lg z-20">
                                <ul className="divide-y divide-stone-700">
                                    {searchResults.map(result => (
                                        <li key={result.chapterId}>
                                            <button 
                                                onClick={() => handleResultClick(result.chapterId)}
                                                className="w-full text-left p-4 hover:bg-stone-700/50 transition-colors"
                                            >
                                                <p className="font-semibold text-amber-300">{result.chapterTitle}</p>
                                                <p 
                                                    className="text-sm text-stone-400 mt-1"
                                                    dangerouslySetInnerHTML={{ __html: result.snippet }}
                                                />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setIsReportVisible(true)}
                        className="p-2 rounded-full hover:bg-stone-700/60 transition-colors duration-200"
                        aria-label="Mostrar informe de investigación"
                        title="Informe de Investigación"
                    >
                        <InfoIcon className="w-6 h-6 text-stone-300" />
                    </button>
                    <button
                        onClick={handleClearAll}
                        disabled={isGenerating}
                        className="p-2 rounded-full hover:bg-red-800/60 transition-colors duration-200"
                        aria-label="Borrar todo el contenido generado"
                        title="Borrar Todo"
                    >
                        <TrashIcon className="w-6 h-6 text-stone-300" />
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
                           clearChapter={() => handleClearChapter(currentChapter.id)}
                       />
                   )}
                </main>
            </div>
            <footer className="bg-black/20 text-center p-4 border-t border-stone-700/50 shadow-inner">
                <blockquote className="max-w-3xl mx-auto">
                    <p className="text-stone-400 italic text-sm">
                        “Cristo glorioso, Tú que resplandeces sobre el mundo, y llevas en tu pecho la libertad que transforma, haz de mi alma un espacio abierto, libre de temor, lleno de tu luz. Que en Ti encuentre mi morada, y en tu abrazo, mi descanso eterno. Amén.”
                    </p>
                </blockquote>
            </footer>
            <ResearchReportModal 
                isOpen={isReportVisible} 
                onClose={() => setIsReportVisible(false)} 
            />
        </div>
    );
};

export default App;