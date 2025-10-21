import React, { useState, useEffect, useRef } from 'react';
import type { Chapter } from '../types';
import { SparklesIcon, DownloadIcon, TrashIcon, PencilIcon, MicrophoneIcon, StarIcon, BookmarkIcon } from './IconComponents';

// SpeechRecognition might not be on the window type, so we declare it.
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}


const MediaNarrative: React.FC<{ audioUrl?: string; videoUrl?: string }> = ({ audioUrl, videoUrl }) => {
    if (!audioUrl && !videoUrl) {
        return null;
    }

    return (
        <div className="my-8 p-4 bg-stone-800/50 border border-stone-700 rounded-lg space-y-6 not-prose">
            {audioUrl && (
                <div>
                    <h4 className="text-lg font-semibold text-amber-300 mb-3">Narración en Audio</h4>
                    <audio controls className="w-full">
                        <source src={audioUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}
            {videoUrl && (
                 <div>
                    <h4 className="text-lg font-semibold text-amber-300 mb-3">Narración en Video</h4>
                    <video controls className="w-full rounded-md">
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}
        </div>
    );
};

interface ChapterViewProps {
    chapter: Chapter;
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


export const ChapterView: React.FC<ChapterViewProps> = ({ 
    chapter, 
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
    onToggleRead 
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
                        <MediaNarrative audioUrl={chapter.audioUrl} videoUrl={chapter.videoUrl} />
                        <div dangerouslySetInnerHTML={{ __html: content }} />
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