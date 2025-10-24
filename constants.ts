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
        id: 'part-1-revelacion',
        title: 'Parte I: La Revelación - El Dios que se Manifiesta',
        description: 'Explorando las formas en que un Dios infinito se da a conocer a la humanidad finita.',
        chapters: [
            {
                id: 'chap-1-1-creacion',
                title: 'El Lenguaje de la Creación: Hablar sin Palabras',
                synopsis: 'Una reflexión sobre cómo los cielos, la tierra y cada ser viviente son un testimonio constante de la gloria, el poder y la naturaleza de Dios, una revelación silenciosa pero elocuente.',
            },
            {
                id: 'chap-1-2-conciencia',
                title: 'El Susurro en el Corazón: La Conciencia y el Espíritu',
                synopsis: 'Un análisis de la conciencia como el eco de la ley de Dios escrita en nosotros y el papel del Espíritu Santo como la voz íntima que nos guía, nos convence y nos atrae hacia el Padre.',
            },
            {
                id: 'chap-1-3-profetas',
                title: 'La Voz en el Fuego: Profetas y Teofanías',
                synopsis: 'Un recorrido por los momentos en que Dios irrumpió en la historia de manera directa y audible, a través de sus profetas escogidos y de manifestaciones sobrenaturales que revelaron su santidad y su plan.',
            },
        ]
    },
    {
        id: 'part-2-palabra',
        title: 'Parte II: La Palabra - El Verbo Hecho Carne',
        description: 'Profundizando en la Escritura como la revelación infalible y en Cristo como la Palabra definitiva de Dios.',
        chapters: [
            {
                id: 'chap-2-1-escritura',
                title: 'La Escritura: Tinta y Fuego Divino',
                synopsis: 'Una meditación sobre la naturaleza dual de la Biblia: un texto divinamente inspirado y preservado, que es a la vez letra precisa y espíritu que arde, transforma y da vida.',
            },
            {
                id: 'chap-2-2-yeshua',
                title: 'Yeshúa: La Palabra Viva entre Nosotros',
                synopsis: 'Una exploración de la encarnación como el acto cumbre de la comunicación de Dios. En Yeshúa, Dios no solo habló, sino que se convirtió en el Mensaje, la revelación perfecta del Padre.',
            },
            {
                id: 'chap-2-3-espiritu',
                title: 'El Espíritu Santo: El Intérprete de la Verdad',
                synopsis: 'Un estudio sobre cómo el Espíritu Santo ilumina las Escrituras y testifica de Cristo en nuestros corazones, haciendo que la Palabra revelada se convierta en una verdad personal y transformadora.',
            },
        ]
    },
    {
        id: 'interludio-caminar',
        title: 'Interludio: Orar sin Cesar',
        description: 'Una pausa para meditar en la dependencia constante y la comunión incesante con el Padre.',
        chapters: [
            {
                id: 'chap-interludio-orar-sin-cesar',
                title: 'Proclamación: Caminar con Dios',
                synopsis: 'Una declaración de rendición que reconoce el control limitado del hombre y la soberanía total de Dios en cada paso de la vida.'
            }
        ]
    },
    {
        id: 'part-3-respuesta',
        title: 'Parte III: La Respuesta - El Alma que Escucha',
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
            },
            {
                id: 'chap-new-5',
                title: 'La Fe que Mueve Montañas',
                synopsis: 'Una meditación sobre la naturaleza de la fe verdadera, no como un sentimiento, sino como una convicción activa y obediente que, arraigada en la fidelidad de Dios, tiene el poder de superar lo imposible y manifestar Su gloria.',
            },
            {
                id: 'chap-new-6',
                title: 'El Gozo del Siervo Cumplidor',
                synopsis: 'Una reflexión final sobre la recompensa más profunda de la vida cristiana: no las bendiciones materiales, sino el gozo inefable que proviene de escuchar al Padre decir: "Bien hecho, siervo bueno y fiel".',
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
    },
    {
        id: 'oracion-final',
        title: 'Oración Final',
        description: 'Una declaración final de fe y gratitud.',
        chapters: [
            {
                id: 'chap-oracion-final',
                title: 'Declaración de Fe',
                synopsis: 'Una oración final que encapsula la entrega total, la gratitud anticipada y la fe activa que son el corazón de esta obra.',
            }
        ]
    }
];