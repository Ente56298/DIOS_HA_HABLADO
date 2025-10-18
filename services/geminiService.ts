
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateChapterContent(title: string, synopsis: string): Promise<string> {
    const prompt = `
        Actúa como un teólogo y escritor consumado. Estás escribiendo un capítulo para el libro 'Y Dios Ha Hablado: Revelación, Palabra y Respuesta'.
        El título de este capítulo es: "${title}".

        Basándote en la siguiente sinopsis, escribe un capítulo completo, elocuente y profundo de aproximadamente 800-1000 palabras. Expande cada punto de la sinopsis, manteniendo un tono coherente, académico y reverente. Utiliza las ideas teológicas presentadas como base, pero siéntete libre de elaborar sobre los conceptos. No te limites a enumerar los puntos, sino intégralos en una narrativa cohesiva y bien estructurada.

        Sinopsis:
        ---
        ${synopsis}
        ---

        Por favor, proporciona el resultado en español, formateado como HTML limpio. Usa etiquetas <p> para los párrafos y etiquetas <h3> para los subtítulos si es apropiado para estructurar el contenido. No incluyas el título del capítulo en el cuerpo de la respuesta, solo el contenido del capítulo. La respuesta debe ser únicamente el HTML del capítulo.
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
