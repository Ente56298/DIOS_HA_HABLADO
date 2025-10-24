import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { TableOfContents } from './components/TableOfContents';
import { ChapterView } from './components/ChapterView';
import { generateChapterContent, generateSubtitles, generateUnifiedTranscription } from './services/geminiService';
import { BOOK_STRUCTURE } from './constants';
import { 
    CHAPTER_PREFACIO_NEW_CONTENT,
    CHAPTER_NEW_1_CONTENT,
    CHAPTER_NEW_2_CONTENT,
    CHAPTER_NEW_3_CONTENT,
    CHAPTER_NEW_4_CONTENT,
    CHAPTER_NEW_5_CONTENT,
    CHAPTER_NEW_6_CONTENT,
    CHAPTER_APENDICE_GLOSARIO_CONTENT,
    CHAPTER_APENDICE_REFERENCIAS_CONTENT,
} from './prefilledContent';
import type { BookContent, Chapter, Signature } from './types';
import { BookIcon, InfoIcon, TrashIcon, SearchIcon, DownloadIcon, SwitchHorizontalIcon } from './components/IconComponents';
import { ResearchReportModal } from './components/ResearchReportModal';

const initialBookContent: BookContent = {
    'chap-prefacio-new': CHAPTER_PREFACIO_NEW_CONTENT,
    'chap-new-1': CHAPTER_NEW_1_CONTENT,
    'chap-new-2': CHAPTER_NEW_2_CONTENT,
    'chap-new-3': CHAPTER_NEW_3_CONTENT,
    'chap-new-4': CHAPTER_NEW_4_CONTENT,
    'chap-new-5': CHAPTER_NEW_5_CONTENT,
    'chap-new-6': CHAPTER_NEW_6_CONTENT,
    'chap-apendice-glosario': CHAPTER_APENDICE_GLOSARIO_CONTENT,
    'chap-apendice-referencias': CHAPTER_APENDICE_REFERENCIAS_CONTENT,
};

const initialSignature: Signature = {
    part1: { aramaic: "Aved Ar’a", spanish: "Siervo de la tierra" },
    part2: { aramaic: "Gibbar di Kravá", spanish: "guerrero de batalla" },
    part3: { aramaic: "Bar di Nachalá", spanish: "hijo del legado" },
};

interface SearchResult {
    chapterId: string;
    chapterTitle: string;
    snippet: string;
}

export interface AudioFile {
    id: string;
    url: string;
    name: string;
    subtitles?: string;
    isGeneratingSubs?: boolean;
    error?: string;
}

export interface ChapterMediaState {
    userAudios: AudioFile[];
    userVideoUrl?: string;
    unifiedTranscription?: string;
    isGeneratingUnified?: boolean;
    unifiedError?: string;
}

const App: React.FC = () => {
    const [bookContent, setBookContent] = useState<BookContent>(initialBookContent);
    const [generatingChapters, setGeneratingChapters] = useState<Set<string>>(new Set());
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [isReportVisible, setIsReportVisible] = useState<boolean>(false);
    
    const initialView = 'chap-prefacio-new';
    const [currentView, setCurrentView] = useState<string>(initialView);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    
    const [editingChapterId, setEditingChapterId] = useState<string | null>(null);

    const [mediaState, setMediaState] = useState<{ [key: string]: ChapterMediaState }>({});

    const [favoriteChapters, setFavoriteChapters] = useState<Set<string>>(() => {
        try {
            const saved = localStorage.getItem('favoriteChapters');
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch (error) {
            console.error("Failed to parse favorite chapters from localStorage", error);
            return new Set();
        }
    });

    const [readChapters, setReadChapters] = useState<Set<string>>(() => {
        try {
            const saved = localStorage.getItem('readChapters');
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch (error) {
            console.error("Failed to parse read chapters from localStorage", error);
            return new Set();
        }
    });
    
    const [progressMode, setProgressMode] = useState<'read' | 'generated'>('read');

    const [signature, setSignature] = useState<Signature>(() => {
        try {
            const saved = localStorage.getItem('authorSignature');
            return saved ? JSON.parse(saved) : initialSignature;
        } catch (error) {
            console.error("Failed to parse signature from localStorage", error);
            return initialSignature;
        }
    });

    useEffect(() => {
        localStorage.setItem('authorSignature', JSON.stringify(signature));
    }, [signature]);

    const handleSignatureChange = (part: 'part1' | 'part2' | 'part3', type: 'aramaic' | 'spanish', value: string) => {
        setSignature(prev => ({
            ...prev,
            [part]: {
                ...prev[part],
                [type]: value,
            }
        }));
    };

    useEffect(() => {
        localStorage.setItem('favoriteChapters', JSON.stringify(Array.from(favoriteChapters)));
    }, [favoriteChapters]);

    useEffect(() => {
        localStorage.setItem('readChapters', JSON.stringify(Array.from(readChapters)));
    }, [readChapters]);

    const allChapters = useMemo(() => BOOK_STRUCTURE.flatMap(part => part.chapters), []);
    const totalChapters = allChapters.length;
    const prefilledChapterIds = useMemo(() => new Set(Object.keys(initialBookContent)), []);

    useEffect(() => {
        setEditingChapterId(null);
    }, [currentView]);

    const handleNavigate = (chapterId: string) => {
        if (editingChapterId && editingChapterId !== chapterId) {
            if (window.confirm('Tiene cambios sin guardar en el capítulo actual. ¿Desea descartarlos y continuar?')) {
                setEditingChapterId(null);
            } else {
                return;
            }
        }
        setCurrentView(chapterId);
    };

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
        handleNavigate(chapterId);
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
    
    const handleUpdateChapterContent = useCallback((chapterId: string, newContent: string) => {
        setBookContent(prev => ({
            ...prev,
            [chapterId]: newContent,
        }));
        setEditingChapterId(null);
    }, []);

    const handleToggleFavorite = useCallback((chapterId: string) => {
        setFavoriteChapters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(chapterId)) {
                newSet.delete(chapterId);
            } else {
                newSet.add(chapterId);
            }
            return newSet;
        });
    }, []);

    const handleToggleRead = useCallback((chapterId: string) => {
        setReadChapters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(chapterId)) {
                newSet.delete(chapterId);
            } else {
                newSet.add(chapterId);
            }
            return newSet;
        });
    }, []);

    const handleMediaUpload = useCallback((chapterId: string, files: File[]) => {
        const videoFile = files.find(f => f.type.startsWith('video/'));
        if (videoFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string;
                setMediaState(prev => ({
                    ...prev,
                    [chapterId]: {
                        ...(prev[chapterId] || { userAudios: [] }),
                        userVideoUrl: dataUrl,
                    }
                }));
            };
            reader.onerror = () => {
                console.error("Error reading file:", reader.error);
                alert(`Error al leer el archivo "${videoFile.name}".\n\nNo se pudo leer el archivo. Esto puede ocurrir si el archivo fue movido o eliminado después de seleccionarlo, o debido a problemas de permisos.\n\nPor favor, inténtelo de nuevo.`);
            };
            reader.readAsDataURL(videoFile);
        }

        const audioFiles = files.filter(f => f.type.startsWith('audio/'));
        if (audioFiles.length === 0) return;

        const currentAudios = mediaState[chapterId]?.userAudios || [];
        const availableSlots = 100 - currentAudios.length;

        if (availableSlots <= 0) {
            alert("No se pueden agregar más de 100 archivos de audio.");
            return;
        }

        const filesToAdd = audioFiles.slice(0, availableSlots);
        if (audioFiles.length > filesToAdd.length) {
            alert(`Límite de 100 audios alcanzado. Solo se agregarán ${filesToAdd.length} de los ${audioFiles.length} archivos seleccionados.`);
        }

        const readFile = (file: File): Promise<AudioFile | null> => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    resolve({
                        id: `${Date.now()}-${file.name}-${Math.random()}`,
                        url: e.target?.result as string,
                        name: file.name,
                    });
                };
                reader.onerror = () => {
                    console.error("Error reading file:", reader.error);
                    alert(`Error al leer el archivo "${file.name}".`);
                    resolve(null);
                };
                reader.readAsDataURL(file);
            });
        };

        Promise.all(filesToAdd.map(readFile)).then(newAudios => {
            const successfulAudios = newAudios.filter((a): a is AudioFile => a !== null);
            if (successfulAudios.length > 0) {
                setMediaState(prev => {
                    const current = prev[chapterId]?.userAudios || [];
                    const chapterMedia = prev[chapterId] || { userAudios: [] };
                    return {
                        ...prev,
                        [chapterId]: {
                            ...chapterMedia,
                            userAudios: [...current, ...successfulAudios],
                        }
                    };
                });
            }
        });
    }, [mediaState]);
    
    const handleRemoveAudio = useCallback((chapterId: string, audioId: string) => {
        setMediaState(prev => {
            const chapterMedia = prev[chapterId];
            if (!chapterMedia) return prev;
            
            return {
                ...prev,
                [chapterId]: {
                    ...chapterMedia,
                    userAudios: chapterMedia.userAudios.filter(audio => audio.id !== audioId),
                }
            };
        });
    }, []);

    const handleReorderAudios = useCallback((chapterId: string, startIndex: number, endIndex: number) => {
        setMediaState(prev => {
            const chapterMedia = prev[chapterId];
            if (!chapterMedia || !chapterMedia.userAudios || startIndex === endIndex) return prev;
    
            const audios = Array.from(chapterMedia.userAudios);
            const [removed] = audios.splice(startIndex, 1);
            audios.splice(endIndex, 0, removed);
    
            return {
                ...prev,
                [chapterId]: {
                    ...chapterMedia,
                    userAudios: audios,
                }
            };
        });
    }, []);

    const handleGenerateSubtitles = useCallback(async (chapterId: string, audioId: string) => {
        const audioFile = mediaState[chapterId]?.userAudios.find(a => a.id === audioId);
        if (!audioFile) return;

        setMediaState(prev => ({
            ...prev,
            [chapterId]: {
                ...prev[chapterId],
                userAudios: prev[chapterId].userAudios.map(audio => 
                    audio.id === audioId ? { ...audio, isGeneratingSubs: true, error: undefined } : audio
                ),
            }
        }));

        try {
            const [meta, base64Data] = audioFile.url.split(',');
            const mimeType = meta.split(':')[1].split(';')[0];
            const subtitles = await generateSubtitles(base64Data, mimeType);

            setMediaState(prev => ({
                ...prev,
                [chapterId]: {
                    ...prev[chapterId],
                    userAudios: prev[chapterId].userAudios.map(audio => 
                        audio.id === audioId ? { ...audio, subtitles, isGeneratingSubs: false } : audio
                    ),
                }
            }));

        } catch (error) {
            console.error("Subtitle generation failed:", error);
            setMediaState(prev => ({
                ...prev,
                [chapterId]: {
                    ...prev[chapterId],
                    userAudios: prev[chapterId].userAudios.map(audio => 
                        audio.id === audioId ? { ...audio, isGeneratingSubs: false, error: 'Error al generar los subtítulos.' } : audio
                    ),
                }
            }));
        }
    }, [mediaState]);

    const handleGenerateAllSubtitles = useCallback(async (chapterId: string) => {
        const chapterMedia = mediaState[chapterId];
        if (!chapterMedia || !chapterMedia.userAudios) return;

        const audiosToProcess = chapterMedia.userAudios.filter(audio => !audio.subtitles && !audio.isGeneratingSubs);

        if (audiosToProcess.length === 0) {
            alert("Todos los audios ya tienen subtítulos o su generación está en curso.");
            return;
        }

        setMediaState(prev => ({
            ...prev,
            [chapterId]: {
                ...prev[chapterId],
                userAudios: prev[chapterId].userAudios.map(audio => 
                    audiosToProcess.some(a => a.id === audio.id) ? { ...audio, isGeneratingSubs: true, error: undefined } : audio
                ),
            }
        }));

        for (const audioFile of audiosToProcess) {
            try {
                const [meta, base64Data] = audioFile.url.split(',');
                const mimeType = meta.split(':')[1].split(';')[0];
                const subtitles = await generateSubtitles(base64Data, mimeType);
    
                setMediaState(prev => ({
                    ...prev,
                    [chapterId]: {
                        ...prev[chapterId],
                        userAudios: prev[chapterId].userAudios.map(audio => 
                            audio.id === audioFile.id ? { ...audio, subtitles, isGeneratingSubs: false } : audio
                        ),
                    }
                }));
            } catch (error) {
                console.error(`Subtitle generation failed for ${audioFile.name}:`, error);
                setMediaState(prev => ({
                    ...prev,
                    [chapterId]: {
                        ...prev[chapterId],
                        userAudios: prev[chapterId].userAudios.map(audio => 
                            audio.id === audioFile.id ? { ...audio, isGeneratingSubs: false, error: 'Error al generar los subtítulos.' } : audio
                        ),
                    }
                }));
            }
        }
    }, [mediaState]);

    const handleGenerateUnifiedTranscription = useCallback(async (chapterId: string) => {
        const chapterMedia = mediaState[chapterId];
        if (!chapterMedia || !chapterMedia.userAudios) return;

        const transcriptions = chapterMedia.userAudios
            .filter(audio => audio.subtitles)
            .map(audio => `--- Transcripción de ${audio.name} ---\n${audio.subtitles}`);
        
        if (transcriptions.length < 2) {
            alert("Se necesitan al menos dos transcripciones para generar un texto unificado.");
            return;
        }

        setMediaState(prev => ({
            ...prev,
            [chapterId]: { ...prev[chapterId], isGeneratingUnified: true, unifiedError: undefined }
        }));

        try {
            const unifiedText = await generateUnifiedTranscription(transcriptions);
            setMediaState(prev => ({
                ...prev,
                [chapterId]: { ...prev[chapterId], unifiedTranscription: unifiedText, isGeneratingUnified: false }
            }));
        } catch (error) {
            console.error("Unified transcription generation failed:", error);
            setMediaState(prev => ({
                ...prev,
                [chapterId]: { ...prev[chapterId], isGeneratingUnified: false, unifiedError: 'Error al generar la transcripción unificada.' }
            }));
        }
    }, [mediaState]);

    const handleExportBook = useCallback(() => {
        const generatedChaptersCount = Object.keys(bookContent).length;
        if (generatedChaptersCount === 0) {
            alert('No hay capítulos generados para exportar.');
            return;
        }

        const aramaicLine = `${signature.part1.aramaic}, ${signature.part2.aramaic}, ${signature.part3.aramaic}`;
        const hebrewLine = `עָבֵד אַרְעָא גִּבָּר דִּי קְרָבָא בַּר דִּי נַחֲלָה`;
        const spanishLine = `(${signature.part1.spanish}, ${signature.part2.spanish}, ${signature.part3.spanish})`;
        const signatureHtml = `
<br>
<hr style="border: none; border-top: 1px solid #44403c; margin-top: 1rem; margin-bottom: 1rem;">
<p style="text-align: center; font-style: italic; color: #a8a29e;">
    FIRMA: ${aramaicLine}
    <br>
    <span style="font-size: 1.1em; color: #a8a29e; font-family: 'Times New Roman', serif;">${hebrewLine}</span>
    <br>
    <span style="font-size: 0.9em; color: #78716c;">${spanishLine}</span>
    <br>
    <span style="font-size: 0.9em; color: #78716c;">(Nombre Simbólico que mi Padre me ha otorgado)</span>
</p>`;
        
        let bookHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Y Dios Ha Hablado: Revelación, Palabra y Respuesta</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lato:wght@300;400&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Lato', sans-serif; background-color: #1c1917; color: #d6d3d1; line-height: 1.7; margin: 0; padding: 2rem 1rem; }
        .container { max-width: 768px; margin: 0 auto; }
        .page-break { page-break-after: always; }
        h1, h2, h3, h4 { font-family: 'Cormorant Garamond', serif; color: #fcd34d; margin-bottom: 1rem; font-weight: 600; }
        h1.book-title { font-size: 3.5rem; text-align: center; border-bottom: 1px solid #44403c; padding-bottom: 1.5rem; margin-bottom: 1rem; }
        h2.book-subtitle { font-size: 1.5rem; text-align: center; color: #f59e0b; margin-bottom: 3rem; }
        h3.part-title { font-size: 2.2rem; margin-top: 4rem; border-bottom: 1px solid #44403c; padding-bottom: 0.5rem; }
        h4.chapter-title { font-size: 1.8rem; margin-top: 2.5rem; color: #fbbf24; }
        p { margin-bottom: 1.25rem; }
        blockquote { border-left: 4px solid #f59e0b; padding-left: 1rem; margin-left: 0; font-style: italic; color: #a8a29e; }
        ul { list-style-type: disc; padding-left: 1.5rem; }
        li { margin-bottom: 0.5rem; }
        hr { border: none; border-top: 1px solid #44403c; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="book-title">Y Dios Ha Hablado</h1>
        <h2 class="book-subtitle">Revelación, Palabra y Respuesta</h2>
        <div class="page-break"></div>
`;

        BOOK_STRUCTURE.forEach(part => {
            bookHtml += `<h3 class="part-title">${part.title}</h3>`;
            part.chapters.forEach(chapter => {
                const content = bookContent[chapter.id];
                if (content) {
                    bookHtml += `<h4 class="chapter-title">${chapter.title}</h4>`;
                    bookHtml += `<div>${content}</div>`;
                }
            });
            bookHtml += `<div class="page-break"></div>`;
        });

        bookHtml += signatureHtml;
        bookHtml += `
    </div>
</body>
</html>`;

        const blob = new Blob([bookHtml], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Y_Dios_Ha_Hablado_Libro_Completo.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [bookContent, signature]);

    const currentChapter = useMemo(() => {
        return allChapters.find(c => c.id === currentView);
    }, [currentView, allChapters]);

    const generatedCount = useMemo(() => Object.keys(bookContent).length, [bookContent]);
    const readCount = readChapters.size;

    return (
        <div className="bg-stone-900 text-stone-100 min-h-screen">
            <header className="bg-stone-950/70 backdrop-blur-md border-b border-stone-800/50 sticky top-0 z-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center space-x-4">
                            <BookIcon className="w-10 h-10 text-amber-400"/>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-gradient">Y Dios Ha Hablado</h1>
                                <p className="text-sm text-stone-400">Generador de Contenido por JAH</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <button onClick={() => setIsReportVisible(true)} className="flex items-center gap-2 text-sm text-stone-300 hover:text-amber-300 transition-colors p-2 rounded-md hover:bg-stone-800/50">
                                <InfoIcon className="w-5 h-5"/>
                                <span>Informe de Investigación</span>
                            </button>
                            <button onClick={handleExportBook} className="flex items-center gap-2 text-sm bg-amber-600 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-amber-500 transition-colors">
                                <DownloadIcon className="w-5 h-5"/>
                                <span>Exportar Libro</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className="lg:col-span-1 bg-stone-950/50 p-6 rounded-lg border border-stone-800/60 self-start sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
                    <div className="relative mb-6">
                        <SearchIcon className="w-5 h-5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar en el libro..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full bg-stone-800/60 border border-stone-700 rounded-md py-2 pl-10 pr-4 text-stone-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                        {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-stone-800 border border-stone-700 rounded-md shadow-lg max-h-80 overflow-y-auto z-10">
                                {searchResults.map(result => (
                                    <button 
                                        key={result.chapterId}
                                        onClick={() => handleResultClick(result.chapterId)}
                                        className="w-full text-left p-3 hover:bg-stone-700/50 transition-colors"
                                    >
                                        <p className="font-semibold text-amber-300">{result.chapterTitle}</p>
                                        <p className="text-sm text-stone-400" dangerouslySetInnerHTML={{__html: result.snippet}}></p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-between p-2 bg-stone-800 rounded-lg mb-4">
                        <span className="text-sm font-semibold text-stone-300">Modo de Progreso:</span>
                        <div className="relative flex items-center bg-stone-900 rounded-md p-1">
                            <button onClick={() => setProgressMode('read')} className={`px-3 py-1 text-sm rounded transition-colors z-10 ${progressMode === 'read' ? 'text-black' : 'text-stone-300'}`}>Leídos</button>
                            <button onClick={() => setProgressMode('generated')} className={`px-3 py-1 text-sm rounded transition-colors z-10 ${progressMode === 'generated' ? 'text-black' : 'text-stone-300'}`}>Generados</button>
                            <span className={`absolute top-1 bottom-1 bg-amber-400 rounded-sm shadow-lg transition-transform duration-300 ease-in-out ${progressMode === 'read' ? 'left-1 w-[71px]' : 'left-[79px] w-[95px]'}`}></span>
                        </div>
                    </div>
                    <TableOfContents
                        structure={BOOK_STRUCTURE}
                        currentView={currentView}
                        setCurrentView={handleNavigate}
                        generatingChapters={generatingChapters}
                        generatedChapters={new Set(Object.keys(bookContent))}
                        prefilledChapterIds={prefilledChapterIds}
                        favoriteChapters={favoriteChapters}
                        readChapters={readChapters}
                        progressMode={progressMode}
                        totalChapters={totalChapters}
                        readCount={readCount}
                        generatedCount={generatedCount}
                    />
                </aside>

                <div className="lg:col-span-3">
                    <div className="bg-stone-950/50 p-6 sm:p-8 rounded-lg border border-stone-800/60 min-h-[calc(100vh-7rem)]">
                        {currentChapter ? (
                            <ChapterView
                                key={currentChapter.id}
                                chapter={currentChapter}
                                signature={signature}
                                content={bookContent[currentChapter.id]}
                                isGenerating={generatingChapters.has(currentChapter.id)}
                                generateChapter={() => handleGenerateChapter(currentChapter)}
                                clearChapter={() => handleClearChapter(currentChapter.id)}
                                editingChapterId={editingChapterId}
                                setEditingChapterId={setEditingChapterId}
                                onUpdateContent={handleUpdateChapterContent}
                                isFavorite={favoriteChapters.has(currentChapter.id)}
                                isRead={readChapters.has(currentChapter.id)}
                                onToggleFavorite={() => handleToggleFavorite(currentChapter.id)}
                                onToggleRead={() => handleToggleRead(currentChapter.id)}
                                mediaState={mediaState[currentChapter.id]}
                                onUploadMedia={(files) => handleMediaUpload(currentChapter.id, files)}
                                onRemoveAudio={(audioId) => handleRemoveAudio(currentChapter.id, audioId)}
                                onReorderAudios={(startIndex, endIndex) => handleReorderAudios(currentChapter.id, startIndex, endIndex)}
                                onGenerateSubtitles={(audioId) => handleGenerateSubtitles(currentChapter.id, audioId)}
                                onGenerateAllSubtitles={() => handleGenerateAllSubtitles(currentChapter.id)}
                                onGenerateUnified={() => handleGenerateUnifiedTranscription(currentChapter.id)}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-center">
                                <p className="text-stone-400">Seleccione un capítulo para comenzar.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            
            <ResearchReportModal isOpen={isReportVisible} onClose={() => setIsReportVisible(false)} />
        </div>
    );
};

export default App;
