import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateChapterContent(title: string, synopsis: string, audioUrl?: string, videoUrl?: string): Promise<string> {
    const mediaContext = (audioUrl || videoUrl) ? `
        Contexto Adicional Importante:
        Este capítulo estará acompañado de narraciones en medios audiovisuales.
        ${videoUrl ? `- Un video que ilustra visualmente los conceptos principales.` : ''}
        ${audioUrl ? `- Una narración en audio para una experiencia auditiva.` : ''}
        Ten en cuenta este contexto para que el texto escrito complemente la experiencia multimedia, quizás adoptando un tono más descriptivo, poético o reflexivo que se alinee con el contenido audiovisual. El texto debe poder sostenerse por sí mismo, pero también enriquecerse al ser consumido junto a los medios.
        ---
        ` : '';
    
    const prompt = `
        Actúa como un teólogo y escritor consumado. Estás escribiendo un capítulo para el libro 'Y Dios Ha Hablado: Revelación, Palabra y Respuesta' en nombre de su autor, JAH.
        El título de este capítulo es: "${title}".

        Basándote en la siguiente sinopsis, escribe un capítulo completo, elocuente y profundo de aproximadamente 800-1000 palabras.

        Sinopsis:
        ---
        ${synopsis}
        ---

        ${mediaContext}

        Estructura el capítulo de la siguiente manera:
        1.  **Versículo guía:** Un versículo bíblico clave que encapsule el tema del capítulo.
        2.  **Introducción:** Una breve y poderosa introducción al tema.
        3.  **Desarrollo del contenido:** Expande la sinopsis en varios puntos numerados (ej. "<h3>1. Título del Punto</h3>"). Deben ser profundos y elocuentes.
        4.  **Aplicación espiritual:** Una sección con puntos prácticos en una lista para que el lector aplique las enseñanzas.
        5.  **Proclamación final:** Una oración o proclamación final que resuma el espíritu del capítulo, dirigida a "JAH".

        Adopta plenamente la siguiente voz y tono del autor (JAH) en cada parte del capítulo. El texto no debe sonar como una explicación académica, sino como una revelación personal, apasionada y humilde.

        Tono y Voz del Autor (JAH) - Instrucciones Detalladas:
        1.  **Relación Íntima y de Rendición:** Dirígete a Dios consistentemente como 'Padre' o 'Abba Padre'. El tono debe ser de una conversación personal, llena de amor filial, asombro y, sobre todo, rendición total a Su voluntad ("No permitas mis deseos, que sea tu voluntad").
        2.  **Contraste Divino/Humano:** El núcleo de la voz de JAH es el contraste entre la autosuficiencia de Dios y la completa dependencia humana. La frase "Dios sin mí sigue siendo DIOS, pero yo sin Dios nada SOY" debe ser un subtexto que impregne todo el capítulo. Muestra la grandeza de Dios no como algo distante, sino como algo que da sentido a nuestra "nada".
        3.  **Tono Profético y Declarativo:** Escribe con autoridad espiritual. Haz afirmaciones audaces y directas sobre la verdad divina, como si fueran proclamaciones reveladas, no meras opiniones. Usa frases que enfaticen el poder vivo de la Palabra ("fuego que enciende el alma").
        4.  **Visión de Propósito Divino:** Presenta el mundo y los eventos de la vida no como una casualidad, sino como un "tejido invisible de misericordia" y propósito divino, donde todo está interconectado por la mano soberana del Padre.
        5.  **Enfoque Cristocéntrico:** Aunque se hable mucho del Padre, la figura de Cristo (Yeshúa) como el "Cordero que vence" y el "refugio eterno" es la culminación de la revelación y la esperanza.

        Ejemplos concretos del estilo de JAH (Inspiración):
        - "Te amo, Padre, como amé a mi hijo cuando lo cargué por primera vez. Reconozco que sin Ti no tengo nada."
        - "Bienaventurados los que vibran en su espíritu, porque el gozo eterno les será dado por su gracia."
        - "Somos una serie de eventos, donde directa o indirectamente estamos relacionados. Nada es casualidad, todo es propósito, todo es tejido invisible de misericordia."
        - "La Palabra de Dios no es tinta sobre pergamino, es fuego que enciende el alma."
        - "ABBA PADRE, TU MORADA ES EL FIRMAMENTO... No permitas mis deseos, que sea tu voluntad la que guíe mi sendero."
        - "Dios sin mí sigue siendo DIOS, pero yo sin Dios nada SOY."
        - "יהוה יֵשׁוּעַ, Tú eres el principio y el fin, el Cordero que vence, el refugio eterno de tu pueblo."

        Referencia Teológica Clave: El autor se apoya firmemente en los Diez Mandamientos como pilar de la Ley divina y en el Padre Nuestro como modelo de oración. Aunque no es necesario citarlos directamente en cada capítulo, su espíritu de obediencia, reverencia y dependencia filial debe impregnar el texto.

        IMPORTANTE: NO incluyas la firma del autor al final del capítulo. La respuesta debe ser únicamente el contenido del capítulo (versículo, introducción, desarrollo, aplicación, proclamación). NO AÑADIR LA FIRMA.

        Por favor, proporciona el resultado en español, formateado como HTML limpio. Usa etiquetas <p> para los párrafos, <h3> para los subtítulos de las secciones, <ul> y <li> para las listas, y <blockquote> para los versículos y proclamaciones. No incluyas el título principal del capítulo en el cuerpo de la respuesta, solo el contenido del capítulo. La respuesta debe ser únicamente el HTML del capítulo.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });

        const text = response.text.trim();
        // Clean up potential markdown code fences if the model adds them
        return text.replace(/^```html\s*|```$/g, '');
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate chapter content from Gemini API.");
    }
}

export async function generateSubtitles(base64Data: string, mimeType: string): Promise<string> {
    const prompt = "Transcribe el siguiente audio de forma precisa. Proporciona solo el texto de la transcripción, sin encabezados ni texto adicional.";

    try {
        const audioPart = {
            inlineData: {
                data: base64Data,
                mimeType: mimeType,
            },
        };
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [audioPart, { text: prompt }] },
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API for subtitles:", error);
        throw new Error("Failed to generate subtitles from Gemini API.");
    }
}

export async function generateUnifiedTranscription(transcriptions: string[]): Promise<string> {
    const prompt = `
        Actúa como un editor experto y asistente de redacción. A continuación, se te proporcionarán varias transcripciones de audio, posiblemente fragmentadas, desordenadas o repetitivas.
        Tu tarea es sintetizar estas transcripciones en un único texto coherente, bien estructurado y fácil de leer.

        Instrucciones:
        1.  **Unifica el contenido:** Combina las ideas de todas las transcripciones en un solo cuerpo de texto.
        2.  **Organiza lógicamente:** Estructura el texto de una manera que tenga sentido. Puedes agrupar ideas similares, crear párrafos y, si es apropiado, usar subtítulos simples para mejorar la claridad.
        3.  **Elimina redundancias:** Identifica y elimina frases o ideas que se repiten en las diferentes transcripciones.
        4.  **Mejora la fluidez:** Corrige errores gramaticales, mejora la puntuación y ajusta la redacción para que el texto fluya de manera natural, como si hubiera sido escrito por una sola persona.
        5.  **Mantén la voz original:** Conserva el tono, el estilo y la intención del hablante original. No añadas información nueva ni opiniones propias.

        A continuación se presentan las transcripciones. Procesa el contenido y devuelve únicamente el texto final unificado.

        --- INICIO DE TRANSCRIPCIONES ---
        ${transcriptions.join('\n\n')}
        --- FIN DE TRANSCRIPCIONES ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API for unified transcription:", error);
        throw new Error("Failed to generate unified transcription from Gemini API.");
    }
}

export async function reorderAudiosWithAI(transcriptions: { id: string; content: string }[]): Promise<string[]> {
    const prompt = `
        Actúa como un editor de contenido experto. Se te proporcionará una lista de transcripciones de audio, cada una con un ID único. 
        Tu tarea es analizar el contenido de estas transcripciones y determinar el orden narrativo, cronológico o lógico más coherente.

        Las transcripciones pueden ser partes de una sola narrativa, ideas fragmentadas o segmentos de una conversación.
        Analiza las conexiones temáticas, las secuencias de eventos, las preguntas y respuestas, y cualquier otra pista contextual para establecer el mejor orden posible.

        Devuelve únicamente un array JSON que contenga los IDs de las transcripciones en el orden correcto. No incluyas ninguna otra explicación o texto.

        Ejemplo de entrada de transcripciones:
        [
            { "id": "audio-123", "content": "Para empezar, debemos considerar el contexto histórico." },
            { "id": "audio-456", "content": "En conclusión, estos eventos llevaron a la situación actual." },
            { "id": "audio-789", "content": "Después de establecer el contexto, el siguiente punto es analizar las consecuencias." }
        ]

        Ejemplo de salida esperada:
        ["audio-123", "audio-789", "audio-456"]

        Aquí están las transcripciones a ordenar:
        ${JSON.stringify(transcriptions)}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING
                    }
                }
            }
        });

        const jsonStr = response.text.trim();
        const orderedIds = JSON.parse(jsonStr);
        
        if (!Array.isArray(orderedIds) || !orderedIds.every(id => typeof id === 'string')) {
            throw new Error('La respuesta de la IA no es un array de strings válido.');
        }

        return orderedIds;
    } catch (error) {
        console.error("Error calling Gemini API for reordering audios:", error);
        throw new Error("Failed to reorder audios from Gemini API.");
    }
}