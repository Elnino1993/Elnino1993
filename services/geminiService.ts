import { GoogleGenAI, Type } from "@google/genai";
import { LinkAnalysis } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not set");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeLink = async (url: string): Promise<LinkAnalysis> => {
  const ai = getClient();
  
  const prompt = `
    Analyze the following URL/Domain: "${url}".
    
    Using Google Search, find out:
    1. What is the website's title or main entity name?
    2. What is the primary category or purpose of this site?
    3. Is this generally considered a safe/legitimate domain?
    4. A very brief 1-sentence summary of what the user can expect.
    
    Return the result as a structured JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "The name of the website or entity" },
            category: { type: Type.STRING, description: "The category of the website (e.g., News, Social, Shopping)" },
            isSafe: { type: Type.BOOLEAN, description: "True if the domain appears legitimate and safe" },
            summary: { type: Type.STRING, description: "A one-sentence summary of the link destination" }
          },
          required: ["title", "category", "isSafe", "summary"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as LinkAnalysis;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Fallback if search fails or API key is missing
    return {
      title: "Unknown Link",
      category: "Uncategorized",
      isSafe: true, // Optimistic fallback
      summary: "Could not analyze link details. Proceed with caution."
    };
  }
};
