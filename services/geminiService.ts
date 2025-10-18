
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

        Además de desarrollar el capítulo, debes integrar la voz espiritual y las proclamaciones personales del autor, JAH. El estilo de JAH es profético, directo y lleno de asombro y gratitud. Utiliza las siguientes proclamaciones como inspiración para el tono y el mensaje:

        Inspiración del estilo de JAH:
        - "Te amo, Padre, como amé a mi hijo cuando lo cargué por primera vez. Reconozco que sin Ti no tengo nada."
        - "Bienaventurados los que vibran en su espíritu, porque el gozo eterno les será dado por su gracia."
        - "Somos una serie de eventos, donde directa o indirectamente estamos relacionados. Nada es casualidad, todo es propósito, todo es tejido invisible de misericordia."
        - "La Palabra de Dios no es tinta sobre pergamino, es fuego que enciende el alma."
        - "ABBA PADRE, TU MORADA ES EL FIRMAMENTO... No permitas mis deseos, que sea tu voluntad la que guíe mi sendero."
        - "Dios sin mí sigue siendo DIOS, pero yo sin Dios nada SOY."
        - "יהוה יֵשׁוּעַ, Tú eres el principio y el fin, el Cordero que vence, el refugio eterno de tu pueblo."

        Referencia Teológica Clave: El autor se apoya firmemente en los Diez Mandamientos como pilar de la Ley divina y en el Padre Nuestro como modelo de oración. Aunque no es necesario citarlos directamente en cada capítulo, su espíritu de obediencia, reverencia y dependencia filial debe impregnar el texto.

        Finalmente, cada capítulo debe concluir con la firma espiritual del autor. Añade la siguiente firma al final del contenido del capítulo, formateada exactamente como se muestra:
        
        <br>
        <hr class="border-stone-700 my-4">
        <p class="text-center italic text-stone-400">
            FIRMA: Aved Ar’a, Gibbar di Kravá, Bar di Nachalá
            <br>
            <span style="font-size: 1.1em; color: #a8a29e; font-family: 'Times New Roman', serif;">עָבֵד אַרְעָא גִּבָּר דִּי קְרָבָא בַּר דִּי נַחֲלָה</span>
            <br>
            <span style="font-size: 0.9em; color: #78716c;">(Siervo de la tierra, guerrero de batalla, hijo del legado)</span>
            <br>
            <span style="font-size: 0.9em; color: #78716c;">(Nombre Simbólico que mi Padre me ha otorgado)</span>
        </p>

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