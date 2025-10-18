
import React from 'react';
import type { Chapter } from '../types';
import { SparklesIcon } from './IconComponents';

interface ChapterViewProps {
    chapter: Chapter;
    content?: string;
    isGenerating: boolean;
    generateChapter: () => void;
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

const Placeholder: React.FC<{ chapterTitle: string; onGenerate: () => void }> = ({ chapterTitle, onGenerate }) => (
    <div className="flex flex-col items-center justify-center text-center text-stone-400 border-2 border-dashed border-stone-700 rounded-lg p-12 h-full">
        <SparklesIcon className="w-16 h-16 text-amber-500 mb-4" />
        <h3 className="text-2xl font-bold text-stone-200">"{chapterTitle}"</h3>
        <p className="mt-2 mb-6 max-w-lg">El contenido de este capítulo aún no ha sido generado.</p>
        <button
            onClick={onGenerate}
            className="bg-amber-600 text-white font-semibold py-2 px-5 rounded-md shadow-md hover:bg-amber-500 transition-all duration-300"
        >
            Generar este capítulo
        </button>
    </div>
);


export const ChapterView: React.FC<ChapterViewProps> = ({ chapter, content, isGenerating, generateChapter }) => {
    return (
        <div className="prose prose-invert prose-p:text-stone-300 prose-h2:text-amber-300 prose-h3:text-amber-400 max-w-none">
            <h2 className="text-4xl font-bold border-b border-stone-700 pb-4 mb-6">{chapter.title}</h2>

            {isGenerating ? (
                <LoadingSpinner />
            ) : content ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
                <Placeholder chapterTitle={chapter.title} onGenerate={generateChapter} />
            )}
        </div>
    );
};
