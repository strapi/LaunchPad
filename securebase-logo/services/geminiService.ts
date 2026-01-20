import { GoogleGenAI, Type } from "@google/genai";
import { LogoAnalysis } from "../types";

// Initialize Gemini Client
// IMPORTANT: API Key is injected via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

const SYSTEM_INSTRUCTION = `
You are a world-class Brand Identity Expert and Senior Art Director. 
Your task is to analyze logos with extreme precision. 
You identify design principles, color psychology, typography styles, and the overall "vibe" of the brand.
You provide professional, insightful, and constructive analysis.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    brandName: { type: Type.STRING, description: "The name of the brand visible in the logo, or 'Unknown' if symbol-only." },
    description: { type: Type.STRING, description: "A detailed visual description of the logo composition." },
    visualElements: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of key visual components (e.g., 'Geometric Sans-serif', 'Abstract Bird Icon')."
    },
    colorPalette: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          hex: { type: Type.STRING, description: "Estimated hex code of the color." },
          name: { type: Type.STRING, description: "Artistic name of the color." },
          description: { type: Type.STRING, description: "Brief meaning of this color in this context." }
        }
      },
      description: "The primary colors used in the design."
    },
    designStyle: { type: Type.STRING, description: "The overall artistic style (e.g., Minimalist, Retro, Grunge, Corporate)." },
    brandPersonality: { type: Type.STRING, description: "Adjectives describing the brand's character (e.g., Trustworthy, Playful, Exclusive)." },
    potentialIndustries: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of likely industries this logo belongs to." 
    },
    sentiment: { type: Type.STRING, description: "Overall emotional response elicited by the logo." }
  },
  required: ["description", "visualElements", "colorPalette", "designStyle", "brandPersonality", "potentialIndustries"]
};

export const analyzeLogoImage = async (base64Image: string, mimeType: string): Promise<LogoAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: "Analyze this logo image deeply. Extract the brand details, styling choices, and color palette."
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.2, // Low temperature for consistent, analytical output
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as LogoAnalysis;
  } catch (error: any) {
    console.error("Gemini Analysis Failed:", error);
    throw new Error(error.message || "Failed to analyze the image.");
  }
};
