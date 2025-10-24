
import { GoogleGenAI } from "@google/genai";

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
