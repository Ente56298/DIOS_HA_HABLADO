
import React from 'react';
import type { Chapter } from '../types';
import { SparklesIcon, DownloadIcon, TrashIcon } from './IconComponents';

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


export const ChapterView: React.FC<ChapterViewProps> = ({ chapter, content, isGenerating, generateChapter, clearChapter }) => {
    
    const handleExport = () => {
        if (!content) return;

        // Sanitize the title for the filename
        const fileName = `${chapter.id}-${chapter.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;

        // Create a full HTML document string with embedded styles
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
        body {
            font-family: 'Lato', sans-serif;
            background-color: #1c1917;
            color: #d6d3d1;
            line-height: 1.7;
            margin: 0;
            padding: 2rem 1rem;
        }
        .container {
            max-width: 768px;
            margin: 0 auto;
        }
        h1, h2, h3 {
            font-family: 'Cormorant Garamond', serif;
            color: #fcd34d; /* amber-300 */
            margin-bottom: 1rem;
            font-weight: 600;
        }
        h1 {
            font-size: 2.5rem;
            border-bottom: 1px solid #44403c;
            padding-bottom: 1rem;
            margin-bottom: 2rem;
        }
        h3 {
            color: #fBBF24; /* amber-400 */
            font-size: 1.5rem;
        }
        p {
            margin-bottom: 1.25rem;
        }
        blockquote {
            border-left: 4px solid #f59e0b;
            padding-left: 1rem;
            margin-left: 0;
            font-style: italic;
            color: #a8a29e;
        }
        ul {
            list-style-type: disc;
            padding-left: 1.5rem;
        }
        li {
            margin-bottom: 0.5rem;
        }
        hr {
            border: none;
            border-top: 1px solid #44403c; /* border-stone-700 */
        }
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
                {content && !isGenerating && (
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
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
            ) : content ? (
                <>
                    <MediaNarrative audioUrl={chapter.audioUrl} videoUrl={chapter.videoUrl} />
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </>
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