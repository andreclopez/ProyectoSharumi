
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config'; 

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("La variable de entorno GEMINI_API_KEY no está definida.");
}

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Función para generar contenido con historial de conversación
 * @param {Array} contents - Array de mensajes en formato Gemini
 * @param {object} config - Configuración de generación
 */
export const generateContentWithHistory = async (contents, config = {}) => {
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash-exp" 
        });

        const result = await model.generateContent({
            contents: contents,
            generationConfig: {
                maxOutputTokens: config.maxOutputTokens || 150,
                temperature: config.temperature || 0.7,
            }
        });

        return {
            text: result.response.text(),
            response: result.response
        };
    } catch (error) {
        console.error("Error en generateContentWithHistory:", error);
        throw error;
    }
};

/**
 * Función simple para un solo prompt (sin historial)
 * @param {string} prompt - Texto del prompt
 * @param {object} config - Configuración opcional
 */
export const generateContent = async (prompt, config = {}) => {
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash-exp" 
        });

        const result = await model.generateContent({
            contents: [{ 
                role: "user", 
                parts: [{ text: prompt }] 
            }],
            generationConfig: {
                maxOutputTokens: config.maxOutputTokens || 150,
                temperature: config.temperature || 0.7,
            }
        });

        return {
            text: result.response.text(),
            response: result.response
        };
    } catch (error) {
        console.error("Error en generateContent:", error);
        throw error;
    }
};

export default genAI;