import type { BookStructure } from './types';

export const BOOK_STRUCTURE: BookStructure = [
    {
        id: 'prefacio-nuevo',
        title: 'Prefacio: Un Encuentro Decisivo',
        description: 'Una nota sobre un momento que redefine el propósito.',
        chapters: [
            {
                id: 'chap-prefacio-new',
                title: 'La Cita con la Eternidad',
                synopsis: 'Una breve nota sobre un momento crucial en el tiempo, una fecha que marca un antes y un después en el camino de la revelación y el propósito divino.',
            }
        ]
    },
    {
        id: 'part-new-1',
        title: 'Parte I: La Naturaleza de la Respuesta',
        description: 'Explorando las profundidades de la respuesta del alma a la voz de Dios.',
        chapters: [
            {
                id: 'chap-new-1',
                title: 'Reconocer a Dios como Padre',
                synopsis: 'Una exploración profunda de la paternidad de Dios, desde Su rol como Creador Soberano hasta la relación íntima y transformadora que ofrece a cada creyente como Sus hijos.',
            },
            {
                id: 'chap-new-2',
                title: 'El Quebranto de la Autosuficiencia',
                synopsis: 'Un interludio espiritual sobre el momento crucial de la rendición, donde el alma abandona la ilusión del control propio para abrazar la total suficiencia del Padre.',
            },
            {
                id: 'chap-new-3',
                title: 'La Reprimenda que Revela Amor',
                synopsis: 'Una meditación sobre la disciplina divina como un acto de amor profundo, una corrección tierna pero firme que no busca humillar, sino despertar y restaurar el alma.',
            },
            {
                id: 'chap-new-4',
                title: 'Solo Dios Tiene Poder... y Él lo Comparte',
                synopsis: 'Una reflexión sobre la naturaleza del poder divino: absoluto en su origen, pero generoso en su manifestación, delegado a Sus hijos para cumplir Su propósito en la tierra.',
            }
        ]
    },
    {
        id: 'apendice',
        title: 'Apéndice',
        description: 'Recursos adicionales para una comprensión más profunda.',
        chapters: [
            {
                id: 'chap-apendice-glosario',
                title: 'Glosario de Términos',
                synopsis: 'Definiciones de términos teológicos, hebreos y arameos clave utilizados a lo largo del libro para facilitar la comprensión del lector.',
            },
            {
                id: 'chap-apendice-referencias',
                title: 'Referencias Bíblicas Clave',
                synopsis: 'Una lista compilada de los versículos y pasajes bíblicos más importantes que fundamentan los argumentos y reflexiones presentados en la obra.',
            }
        ]
    }
];
