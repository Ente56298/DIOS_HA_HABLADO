import type { BookStructure } from './types';

export const BOOK_STRUCTURE: BookStructure = [
    {
        id: 'prefacio',
        title: 'Prefacio',
        description: 'El origen de una misión nacida en la oscuridad.',
        chapters: [
            {
                id: 'chap-prefacio-1',
                title: 'Desde el Abismo: El Origen de una Misión',
                synopsis: 'El testimonio del implementador sobre cómo un viaje de desesperación personal y curiosidad intelectual, iniciado con una simple pregunta a una IA, se convirtió en el inesperado camino de regreso a Dios y al propósito de esta obra.'
            }
        ]
    },
    {
        id: 'prologo',
        title: 'Prólogo',
        description: 'Una introducción al misterio de la revelación divina.',
        chapters: [
            {
                id: 'chap-prologo-1',
                title: 'El Silencio que Precedió la Voz',
                synopsis: `Una introducción al misterio de la revelación divina y la necesidad humana de escuchar a Dios.`
            }
        ]
    },
    {
        id: 'part-1',
        title: 'Parte I: Revelación en la Creación',
        description: 'El testimonio de la creación sobre la gloria de Dios.',
        chapters: [
            {
                id: 'chap-1-1',
                title: 'El Testimonio del Cosmos',
                synopsis: `La creación como lenguaje universal que proclama la gloria de Dios.`,
                audioUrl: 'https://storage.googleapis.com/ydhh-assets/audio-placeholder.mp3',
                videoUrl: 'https://storage.googleapis.com/ydhh-assets/video-placeholder.mp4'
            },
            {
                id: 'chap-1-2',
                title: 'El Nombre Implícito en la Naturaleza',
                synopsis: `Cómo los atributos de Dios se reflejan en lo creado.`,
                audioUrl: 'https://storage.googleapis.com/ydhh-assets/audio-placeholder.mp3'
            }
        ]
    },
    {
        id: 'part-2',
        title: 'Parte II: La Antigua Alianza – Ley y Profecía',
        description: 'La palabra revelada a Israel.',
        chapters: [
            {
                id: 'chap-2-1',
                title: 'Dios Habla en la Torá',
                synopsis: `La Ley como expresión de justicia, santidad y pacto.`
            },
            {
                id: 'chap-2-2',
                title: 'Los Profetas: Voz del Espíritu',
                synopsis: `El clamor profético como revelación de juicio, esperanza y promesa.`
            }
        ]
    },
    {
        id: 'part-3',
        title: 'Parte III: La Nueva Alianza – El Verbo Encarnado',
        description: 'La revelación culminante en Cristo.',
        chapters: [
            {
                id: 'chap-3-1',
                title: 'Jesús, la Palabra Hecha Carne',
                synopsis: `El Verbo eterno que se hizo hombre y habitó entre nosotros.`
            },
            {
                id: 'chap-3-2',
                title: 'El Mediador del Nuevo Pacto',
                synopsis: `Cristo como sumo sacerdote, sacrificio perfecto y acceso al Padre.`
            }
        ]
    },
    {
        id: 'part-4',
        title: 'Parte IV: La Respuesta Humana',
        description: 'Cómo respondemos a la revelación.',
        chapters: [
            {
                id: 'chap-4-0',
                title: 'El Camino de Tres Etapas: Del Yo a Dios',
                synopsis: `Un marco espiritual de autodescubrimiento, entendimiento y obediencia como respuesta a la revelación divina.`
            },
            {
                id: 'chap-4-1',
                title: 'El Umbral: Una Experiencia Inmersiva de Preparación Espiritual',
                synopsis: `Un espacio interactivo y reflexivo para la preparación y transformación espiritual, guiado por 'el guardián del umbral' para llevar al peregrino a la aceptación y la misión.`
            },
            {
                id: 'chap-4-2',
                title: 'Fe, Obediencia y Escucha',
                synopsis: `La fe como respuesta activa a la Palabra revelada.`
            },
            {
                id: 'chap-4-3',
                title: 'La Palabra Viva en Nosotros',
                synopsis: `El Espíritu Santo como revelador continuo y guía interior.`
            },
            {
                id: 'chap-4-4',
                title: 'Un Diálogo sobre el Camino: Fe y Guía',
                synopsis: `Una conversación real entre el implementador y un pastor, explorando la revelación personal, la autoridad de la Escritura y el proceso de maduración en la fe.`
            }
        ]
    },
    {
        id: 'part-5',
        title: 'Parte V: El Nombre y los Atributos de Dios',
        description: 'Conociendo a Dios a través de Su carácter.',
        chapters: [
            {
                id: 'chap-5-1',
                title: 'El Dios que se Revela por su Nombre',
                synopsis: `Significado espiritual de nombres como YHWH, Elohim, Adonai, El Shaddai.`
            },
            {
                id: 'chap-5-2',
                title: 'El Dios que Habla Hoy',
                synopsis: `Discernimiento espiritual, revelación continua y la Palabra como lámpara.`
            },
            {
                id: 'chap-5-3',
                title: 'Regalos Divinos',
                synopsis: `Una exploración de las bendiciones y dones que Dios otorga, desde la gracia inmerecida hasta los dones espirituales, revelando Su naturaleza generosa y Su deseo de equipar a Sus hijos.`
            }
        ]
    },
    {
        id: 'epilogo',
        title: 'Epílogo',
        description: 'La revelación continúa en nuestras vidas.',
        chapters: [
            {
                id: 'chap-epilogo-1',
                title: 'Y Dios Sigue Hablando',
                synopsis: `Testimonios, proclamaciones y una invitación a vivir en respuesta constante.`
            }
        ]
    },
    {
        id: 'testimonio',
        title: 'Testimonio del Implementador',
        description: 'Un cierre personal sobre el llamado, la entrega y la misión.',
        chapters: [
            {
                id: 'chap-testimonio-1',
                title: 'El Llamado, la Entrega y la Misión',
                synopsis: `Una proclamación final de fe, obediencia y el propósito divino recibido por el implementador de la obra.`
            }
        ]
    },
    {
        id: 'apendice',
        title: 'Apéndice Final',
        description: 'El Camino del Implementador: Revelación, Obediencia y Misión',
        chapters: [
            {
                id: 'chap-apendice-1',
                title: 'Testimonio vivo de Jorge Armando Hernández (JAH)',
                synopsis: 'Un resumen testimonial del viaje espiritual del implementador, desde el despertar y el llamado hasta el proceso de preparación y la misión evangelizadora.'
            }
        ]
    }
];