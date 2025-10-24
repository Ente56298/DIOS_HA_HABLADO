import React, { useState, useEffect, useRef } from 'react';
import type { Chapter, Signature } from '../types';
import type { AudioFile, ChapterMediaState } from '../App';
import { SparklesIcon, DownloadIcon, TrashIcon, PencilIcon, MicrophoneIcon, StarIcon, BookmarkIcon, UploadIcon, SubtitlesIcon, CombineIcon, DragHandleIcon } from './IconComponents';

// SpeechRecognition might not be on the window type, so we declare it.
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}


interface AudioItemProps {
    audio: AudioFile;
    onRemove: (audioId: string) => void;
    onGenerateSubtitles: (audioId: string) => void;
    onDragStart: () => void;
    onDragEnd: () => void;
    isDragging: boolean;
}

const AudioItem: React.FC<AudioItemProps> = ({ audio, onRemove, onGenerateSubtitles, onDragStart, onDragEnd, isDragging }) => {
    return (
        <div 
            draggable="true"
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className={`p-3 bg-stone-900/50 rounded-md border border-stone-700 space-y-3 transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'}`}
        >
            <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-2 flex-grow overflow-hidden">
                    <DragHandleIcon className="w-5 h-5 text-stone-500 cursor-grab flex-shrink-0" />
                    <p className="font-semibold text-stone-300 truncate text-sm" title={audio.name}>{audio.name}</p>
                </div>
                <button 
                    onClick={() => onRemove(audio.id)}
                    className="p-1.5 rounded-full hover:bg-red-800/60 transition-colors flex-shrink-0"
                    aria-label="Eliminar audio"
                    title="Eliminar Audio"
                >
                    <TrashIcon className="w-4 h-4 text-stone-300" />
                </button>
            </div>
            <audio controls src={audio.url} className="w-full h-10" />
            <div className="pt-3 border-t border-stone-700/50">
                <div className="flex items-center justify-between">
                    <h5 className="text-md font-semibold text-stone-300">Subtítulos</h5>
                    <button
                        onClick={() => onGenerateSubtitles(audio.id)}
                        disabled={audio.isGeneratingSubs}
                        className="flex items-center gap-2 bg-amber-600 text-white font-semibold py-1.5 px-3 rounded-md shadow-sm hover:bg-amber-500 transition-colors disabled:bg-stone-600 disabled:cursor-not-allowed text-sm"
                    >
                        {audio.isGeneratingSubs ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Generando...
                            </>
                        ) : (
                            <>
                                <SubtitlesIcon className="w-4 h-4" /> Generar
                            </>
                        )}
                    </button>
                </div>
                {audio.isGeneratingSubs && <p className="text-xs text-stone-400 mt-2 text-center">La IA está transcribiendo. Esto puede tardar unos momentos...</p>}
                {audio.error && <p className="text-xs text-red-400 mt-2">{audio.error}</p>}
                {audio.subtitles && (
                    <div className="mt-3 p-3 bg-stone-900/70 rounded-md border border-stone-700 max-h-32 overflow-y-auto">
                        <p className="text-stone-300 whitespace-pre-wrap font-mono text-xs">{audio.subtitles}</p>
                    </div>
                )}
            </div>
        </div>
    );
};


interface MediaNarrativeProps {
    mediaState?: ChapterMediaState;
    onUploadMedia: (files: File[]) => void;
    onRemoveAudio: (audioId: string) => void;
    onReorderAudios: (startIndex: number, endIndex: number) => void;
    onGenerateSubtitles: (audioId: string) => void;
    onGenerateAllSubtitles: () => void;
    onGenerateUnified: () => void;
}

const MediaNarrative: React.FC<MediaNarrativeProps> = ({ 
    mediaState, 
    onUploadMedia, 
    onRemoveAudio, 
    onReorderAudios, 
    onGenerateSubtitles, 
    onGenerateAllSubtitles, 
    onGenerateUnified 
}) => {
    const audioInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const audioListRef = useRef<HTMLDivElement>(null);
    const [isDraggingOverAudio, setIsDraggingOverAudio] = useState(false);
    const [isDraggingOverVideo, setIsDraggingOverVideo] = useState(false);
    const [draggedAudioIndex, setDraggedAudioIndex] = useState<number | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length > 0) {
            onUploadMedia(files);
        }
        event.target.value = '';
    };

    const handleDragEvent = (e: React.DragEvent<HTMLDivElement>, area: 'audio' | 'video', isEntering: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        if (area === 'audio') setIsDraggingOverAudio(isEntering);
        else setIsDraggingOverVideo(isEntering);
    };

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>, area: 'audio' | 'video') => {
        handleDragEvent(e, area, false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            onUploadMedia(files);
        }
    };
    
    const handleAudioDragStart = (index: number) => {
        setDraggedAudioIndex(index);
    };

    const handleAudioDragEnd = () => {
        setDraggedAudioIndex(null);
    };

    const handleAudioDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (draggedAudioIndex === null || !audioListRef.current) return;

        const children = Array.from(audioListRef.current.children) as HTMLElement[];
        const dropTarget = children.find(child => {
            const rect = child.getBoundingClientRect();
            return e.clientY < rect.top + rect.height / 2;
        });
      
        const dropIndex = dropTarget ? children.indexOf(dropTarget) : (mediaState?.userAudios.length ?? 0);
        
        onReorderAudios(draggedAudioIndex, dropIndex < draggedAudioIndex ? dropIndex : dropIndex -1 );
        setDraggedAudioIndex(null);
    };

    const hasAudios = mediaState?.userAudios && mediaState.userAudios.length > 0;
    const hasVideo = !!mediaState?.userVideoUrl;
    const canAddAudio = (mediaState?.userAudios?.length ?? 0) < 100;
    const transcribedCount = mediaState?.userAudios?.filter(a => a.subtitles).length ?? 0;
    const canGenerateUnified = transcribedCount >= 2;
    
    const audiosWithoutSubs = mediaState?.userAudios?.filter(a => !a.subtitles && !a.isGeneratingSubs).length ?? 0;
    const isGeneratingAnySubs = mediaState?.userAudios?.some(a => a.isGeneratingSubs) ?? false;
    const canGenerateAllSubs = audiosWithoutSubs > 0;

    return (
        <div className="my-8 p-4 bg-stone-800/50 border border-stone-700 rounded-lg space-y-6 not-prose">
            {/* --- Audio Section --- */}
            <div 
                onDragEnter={(e) => handleDragEvent(e, 'audio', true)}
                onDragLeave={(e) => handleDragEvent(e, 'audio', false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleFileDrop(e, 'audio')}
                className={`p-4 rounded-md transition-colors border-2 border-dashed ${isDraggingOverAudio ? 'border-amber-500 bg-stone-700/50' : 'border-transparent'}`}
            >
                <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-semibold text-amber-300">Narraciones en Audio ({mediaState?.userAudios?.length ?? 0}/100)</h4>
                    <div className="flex items-center gap-2">
                        {canGenerateAllSubs && (
                            <button
                                onClick={onGenerateAllSubtitles}
                                disabled={isGeneratingAnySubs}
                                className="flex items-center gap-2 bg-teal-600 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-teal-500 transition-colors disabled:bg-stone-600 disabled:cursor-not-allowed"
                                title={isGeneratingAnySubs ? "Generación en curso..." : `Generar subtítulos para ${audiosWithoutSubs} audio(s)`}
                            >
                                {isGeneratingAnySubs ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        <SubtitlesIcon className="w-5 h-5" /> Generar para Todos
                                    </>
                                )}
                            </button>
                        )}
                        {canAddAudio && (
                            <>
                                <input type="file" accept="audio/*" ref={audioInputRef} onChange={handleFileChange} className="hidden" multiple />
                                <button onClick={() => audioInputRef.current?.click()} className="flex items-center gap-2 bg-sky-600 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-sky-500 transition-colors">
                                    <UploadIcon className="w-5 h-5" /> Agregar Audios
                                </button>
                            </>
                        )}
                    </div>
                </div>
                {hasAudios ? (
                    <div 
                        ref={audioListRef}
                        className="space-y-4 max-h-96 overflow-y-auto pr-2"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleAudioDrop}
                    >
                        {mediaState.userAudios.map((audio, index) => (
                            <AudioItem
                                key={audio.id}
                                audio={audio}
                                onRemove={onRemoveAudio}
                                onGenerateSubtitles={onGenerateSubtitles}
                                onDragStart={() => handleAudioDragStart(index)}
                                onDragEnd={handleAudioDragEnd}
                                isDragging={draggedAudioIndex === index}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 border-2 border-dashed border-stone-700 rounded-lg">
                        <p className="text-sm text-stone-400">Arrastre y suelte archivos de audio aquí o use el botón "Agregar Audios".</p>
                    </div>
                )}
            </div>

            {/* --- Unified Transcription Section --- */}
            <div className="pt-6 border-t border-stone-700/50">
                 <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-semibold text-amber-300">Transcripción Unificada y Coherente</h4>
                    <button 
                        onClick={onGenerateUnified}
                        disabled={!canGenerateUnified || mediaState?.isGeneratingUnified}
                        className="flex items-center gap-2 bg-purple-600 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-purple-500 transition-colors disabled:bg-stone-600 disabled:cursor-not-allowed"
                        title={canGenerateUnified ? "Unificar transcripciones en un solo texto" : "Necesitas al menos 2 transcripciones para usar esta función"}
                    >
                        {mediaState?.isGeneratingUnified ? (
                             <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Unificando...
                            </>
                        ) : (
                            <>
                                <CombineIcon className="w-5 h-5" /> Generar Texto Unificado
                            </>
                        )}
                    </button>
                </div>
                 {mediaState?.isGeneratingUnified && <p className="text-xs text-stone-400 mt-2 text-center">La IA está organizando las transcripciones en un texto coherente. Esto puede tomar unos momentos...</p>}
                 {mediaState?.unifiedError && <p className="text-sm text-red-400 mt-2">{mediaState.unifiedError}</p>}
                 {mediaState?.unifiedTranscription ? (
                    <div className="mt-3 p-4 bg-stone-900/70 rounded-md border border-stone-700 max-h-64 overflow-y-auto">
                        <p className="text-stone-200 whitespace-pre-wrap text-sm">{mediaState.unifiedTranscription}</p>
                    </div>
                ) : (
                     <div className="text-center py-6 border-2 border-dashed border-stone-700 rounded-lg">
                        <p className="text-sm text-stone-400">El texto unificado aparecerá aquí.</p>
                    </div>
                )}
            </div>

            {/* --- Video Section --- */}
            <div 
                className={`pt-6 border-t border-stone-700/50 p-4 rounded-md transition-colors border-2 border-dashed ${isDraggingOverVideo ? 'border-amber-500 bg-stone-700/50' : 'border-transparent'}`}
                onDragEnter={(e) => handleDragEvent(e, 'video', true)}
                onDragLeave={(e) => handleDragEvent(e, 'video', false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleFileDrop(e, 'video')}
            >
                <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-semibold text-amber-300">Narración en Video</h4>
                </div>
                {hasVideo ? (
                    <div>
                        <video controls className="w-full rounded-md" key={mediaState.userVideoUrl}>
                            <source src={mediaState.userVideoUrl} />
                            Your browser does not support the video tag.
                        </video>
                        <div className="flex justify-end mt-2">
                            <input type="file" accept="video/*" ref={videoInputRef} onChange={handleFileChange} className="hidden" />
                            <button onClick={() => videoInputRef.current?.click()} className="text-sm text-emerald-400 hover:underline">
                                Cambiar video
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-6 border-2 border-dashed border-stone-700 rounded-lg">
                        <p className="text-sm text-stone-400 mb-3">Arrastre y suelte un archivo de video aquí o use el botón "Cargar Video".</p>
                        <input type="file" accept="video/*" ref={videoInputRef} onChange={handleFileChange} className="hidden" />
                        <button onClick={() => videoInputRef.current?.click()} className="flex items-center gap-2 bg-emerald-600 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-emerald-500 transition-colors mx-auto">
                           <UploadIcon className="w-5 h-5" /> Cargar Video
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


interface ChapterViewProps {
    chapter: Chapter;
    signature: Signature;
    content?: string;
    isGenerating: boolean;
    generateChapter: () => void;
    clearChapter: () => void;
    editingChapterId: string | null;
    setEditingChapterId: (id: string | null) => void;
    onUpdateContent: (chapterId: string, newContent: string) => void;
    isFavorite: boolean;
    isRead: boolean;
    onToggleFavorite: () => void;
    onToggleRead: () => void;
    mediaState?: ChapterMediaState;
    onUploadMedia: (files: File[]) => void;
    onRemoveAudio: (audioId: string) => void;
    onReorderAudios: (startIndex: number, endIndex: number) => void;
    onGenerateSubtitles: (audioId: string) => void;
    onGenerateAllSubtitles: () => void;
    onGenerateUnified: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center text-stone-400 h-full">
         <svg className="animate-spin h-12 w-12 text-amber-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h3 className="text-xl font-semibold text-stone-200">Generando Contenido...</h3>
        <p className="mt-2 max-w-md">La IA está elaborando este capítulo. Este proceso puede tardar un momento. Gracias por su paciencia.</p>
    </div>
);

const Placeholder: React.FC<{ chapterTitle: string; chapterSynopsis: string; onGenerate: () => void }> = ({ chapterTitle, chapterSynopsis, onGenerate }) => (
    <div className="flex flex-col items-center justify-center text-center text-stone-400 border-2 border-dashed border-stone-700 rounded-lg p-12 h-full">
        <SparklesIcon className="w-16 h-16 text-amber-500 mb-4" />
        <h3 className="text-2xl font-bold text-stone-200">"{chapterTitle}"</h3>
        <p className="mt-2 text-stone-300 italic max-w-lg">{chapterSynopsis}</p>
        <p className="mt-4 mb-6 max-w-lg">El contenido de este capítulo aún no ha sido generado.</p>
        <button
            onClick={onGenerate}
            className="bg-amber-600 text-white font-semibold py-2 px-5 rounded-md shadow-md hover:bg-amber-500 transition-all duration-300"
        >
            Generar este capítulo
        </button>
    </div>
);

const SignatureDisplay: React.FC<{ signature: Signature }> = ({ signature }) => {
    const aramaicLine = `${signature.part1.aramaic}, ${signature.part2.aramaic}, ${signature.part3.aramaic}`;
    const hebrewLine = `עָבֵד אַרְעָא גִּבָּר דִּי קְרָבָא בַּר דִּי נַחֲלָה`;
    const spanishLine = `(${signature.part1.spanish}, ${signature.part2.spanish}, ${signature.part3.spanish})`;

    return (
        <div className="not-prose">
            <br />
            <hr className="border-stone-700 my-4" />
            <p className="text-center italic text-stone-400">
                FIRMA: {aramaicLine}
                <br />
                <span style={{ fontSize: '1.1em', color: '#a8a29e', fontFamily: "'Times New Roman', serif" }}>{hebrewLine}</span>
                <br />
                <span style={{ fontSize: '0.9em', color: '#78716c' }}>{spanishLine}</span>
                <br />
                <span style={{ fontSize: '0.9em', color: '#78716c' }}>(Nombre Simbólico que mi Padre me ha otorgado)</span>
            </p>
        </div>
    );
};


export const ChapterView: React.FC<ChapterViewProps> = ({ 
    chapter,
    signature, 
    content, 
    isGenerating, 
    generateChapter, 
    clearChapter, 
    editingChapterId, 
    setEditingChapterId, 
    onUpdateContent,
    isFavorite,
    isRead,
    onToggleFavorite,
    onToggleRead,
    mediaState,
    onUploadMedia,
    onRemoveAudio,
    onReorderAudios,
    onGenerateSubtitles,
    onGenerateAllSubtitles,
    onGenerateUnified
}) => {
    
    const isEditing = editingChapterId === chapter.id;
    const [editedContent, setEditedContent] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isEditing) {
            setEditedContent(content || '');
        }
    }, [isEditing, content]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('La API de reconocimiento de voz no es compatible con este navegador.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'es-ES';

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                setEditedContent(prev => prev.trim() + ' ' + finalTranscript.trim());
            }
        };

        recognition.onend = () => {
            if (isListening) {
                // Restart listening if it was stopped by the browser
                recognition.start();
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Error en el reconocimiento de voz:', event.error);
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [isListening]);
    
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
    }, [editedContent]);

    const handleToggleListen = () => {
        if (!recognitionRef.current) {
            alert('El reconocimiento de voz no está disponible en este navegador.');
            return;
        }
        
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleSave = () => {
        onUpdateContent(chapter.id, editedContent);
    };

    const handleCancel = () => {
        setEditingChapterId(null);
    };
    
    const handleExport = () => {
        if (!content) return;
        const fileName = `${chapter.id}-${chapter.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;

        const aramaicLine = `${signature.part1.aramaic}, ${signature.part2.aramaic}, ${signature.part3.aramaic}`;
        const hebrewLine = `עָבֵד אַרְעָא גִּבָּר דִּי קְרָבָא בַּר דִּי נַחֲלָה`;
        const spanishLine = `(${signature.part1.spanish}, ${signature.part2.spanish}, ${signature.part3.spanish})`;
        const signatureHtml = `
<br>
<hr class="border-stone-700 my-4">
<p class="text-center italic text-stone-400">
    FIRMA: ${aramaicLine}
    <br>
    <span style="font-size: 1.1em; color: #a8a29e; font-family: 'Times New Roman', serif;">${hebrewLine}</span>
    <br>
    <span style="font-size: 0.9em; color: #78716c;">${spanishLine}</span>
    <br>
    <span style="font-size: 0.9em; color: #78716c;">(Nombre Simbólico que mi Padre me ha otorgado)</span>
</p>`;
        
        const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${chapter.title} | Y Dios Ha Hablado</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lato:wght@300;400&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Lato', sans-serif; background-color: #1c1917; color: #d6d3d1; line-height: 1.7; margin: 0; padding: 2rem 1rem; }
        .container { max-width: 768px; margin: 0 auto; }
        h1, h2, h3 { font-family: 'Cormorant Garamond', serif; color: #fcd34d; margin-bottom: 1rem; font-weight: 600; }
        h1 { font-size: 2.5rem; border-bottom: 1px solid #44403c; padding-bottom: 1rem; margin-bottom: 2rem; }
        h3 { color: #fBBF24; font-size: 1.5rem; }
        p { margin-bottom: 1.25rem; }
        blockquote { border-left: 4px solid #f59e0b; padding-left: 1rem; margin-left: 0; font-style: italic; color: #a8a29e; }
        ul { list-style-type: disc; padding-left: 1.5rem; }
        li { margin-bottom: 0.5rem; }
        hr { border: none; border-top: 1px solid #44403c; }
        .my-4 { margin-top: 1rem; margin-bottom: 1rem; }
        .text-center { text-align: center; }
        .italic { font-style: italic; }
        .text-stone-400 { color: #a8a29e; }
        .text-red-400 { color: #f87171; }
    </style>
</head>
<body>
    <main class="container">
        <h1>${chapter.title}</h1>
        <div>
            ${content}
            ${signatureHtml}
        </div>
    </main>
</body>
</html>`;

        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="prose prose-invert prose-lg prose-p:text-stone-200 prose-h2:text-amber-300 prose-h3:text-amber-400 max-w-4xl mx-auto">
            <div className="flex justify-between items-start border-b border-stone-700 pb-4 mb-8">
                <h2 className="text-4xl font-bold border-b-0 pb-0 mb-0">{chapter.title}</h2>
                {content && !isGenerating && !isEditing && (
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                        <button
                            onClick={onToggleFavorite}
                            className="p-2 rounded-full hover:bg-stone-700/60 transition-colors duration-200"
                            aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                            title={isFavorite ? 'Quitar de Favoritos' : 'Añadir a Favoritos'}
                        >
                            <StarIcon className={`w-6 h-6 ${isFavorite ? 'text-amber-400' : 'text-stone-300'}`} filled={isFavorite} />
                        </button>
                        <button
                            onClick={onToggleRead}
                            className="p-2 rounded-full hover:bg-stone-700/60 transition-colors duration-200"
                            aria-label={isRead ? 'Marcar como no leído' : 'Marcar como leído'}
                            title={isRead ? 'Marcar como No Leído' : 'Marcar como Leído'}
                        >
                            <BookmarkIcon className={`w-6 h-6 ${isRead ? 'text-sky-400' : 'text-stone-300'}`} filled={isRead} />
                        </button>
                         <button
                            onClick={() => setEditingChapterId(chapter.id)}
                            className="p-2 rounded-full hover:bg-stone-700/60 transition-colors duration-200"
                            aria-label="Editar contenido del capítulo"
                            title="Editar Contenido"
                        >
                            <PencilIcon className="w-6 h-6 text-stone-300" />
                        </button>
                        <button
                            onClick={handleExport}
                            className="p-2 rounded-full hover:bg-stone-700/60 transition-colors duration-200"
                            aria-label="Exportar capítulo como HTML"
                            title="Exportar como HTML"
                        >
                            <DownloadIcon className="w-6 h-6 text-stone-300" />
                        </button>
                        <button
                            onClick={clearChapter}
                            className="p-2 rounded-full hover:bg-red-800/60 transition-colors duration-200"
                            aria-label="Borrar contenido del capítulo"
                            title="Borrar Contenido"
                        >
                            <TrashIcon className="w-6 h-6 text-stone-300" />
                        </button>
                    </div>
                )}
            </div>

            {isGenerating ? (
                <LoadingSpinner />
            ) : content && !isGenerating ? (
                isEditing ? (
                    <div className="space-y-4 not-prose">
                        <textarea
                            ref={textareaRef}
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full h-[60vh] bg-stone-900/80 border border-stone-600 rounded-md p-4 text-stone-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                            aria-label="Editor de contenido del capítulo"
                        />
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handleToggleListen}
                                className={`flex items-center gap-2 font-semibold py-2 px-4 rounded-md shadow-md transition-all duration-300 ${isListening ? 'bg-red-600 text-white hover:bg-red-500 animate-pulse' : 'bg-sky-600 text-white hover:bg-sky-500'}`}
                            >
                                <MicrophoneIcon className="w-5 h-5" />
                                {isListening ? 'Detener Dictado' : 'Iniciar Dictado'}
                            </button>
                             <div className="flex items-center gap-4">
                                <button
                                    onClick={handleCancel}
                                    className="bg-stone-600 text-white font-semibold py-2 px-5 rounded-md shadow-md hover:bg-stone-500 transition-all duration-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="bg-amber-600 text-white font-semibold py-2 px-5 rounded-md shadow-md hover:bg-amber-500 transition-all duration-300"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <MediaNarrative 
                            mediaState={mediaState}
                            onUploadMedia={onUploadMedia}
                            onRemoveAudio={onRemoveAudio}
                            onReorderAudios={onReorderAudios}
                            onGenerateSubtitles={onGenerateSubtitles}
                            onGenerateAllSubtitles={onGenerateAllSubtitles}
                            onGenerateUnified={onGenerateUnified}
                        />
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                        <SignatureDisplay signature={signature} />
                    </>
                )
            ) : (
                <Placeholder 
                    chapterTitle={chapter.title} 
                    chapterSynopsis={chapter.synopsis}
                    onGenerate={generateChapter} 
                />
            )}
        </div>
    );
};