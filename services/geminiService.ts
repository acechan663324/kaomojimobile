import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateKaomoji = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a single, unique kaomoji based on this description: "${prompt}". Your response must be a JSON object with a single key "kaomoji" containing the kaomoji string. Do not include any other text, explanation, or markdown formatting.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            kaomoji: {
              type: Type.STRING,
              description: "The generated kaomoji.",
            },
          },
        },
        temperature: 0.9,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    if (result && result.kaomoji && typeof result.kaomoji === 'string') {
        return result.kaomoji;
    } else {
        throw new Error("Invalid response format from API.");
    }
  } catch (error) {
    console.error("Error generating kaomoji:", error);
    throw new Error("Failed to generate kaomoji. Please try again.");
  }
};

export const generateKaomojiVariations = async (baseKaomoji: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 4 creative variations based on the kaomoji: "${baseKaomoji}". Your response must be a JSON object with a single key "variations", which is an array of strings, each string being a new kaomoji. Do not include the original kaomoji.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            variations: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "A new kaomoji variation."
              },
            },
          },
        },
        temperature: 0.8,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result && result.variations && Array.isArray(result.variations)) {
      return result.variations.filter((v: any) => typeof v === 'string' && v.length > 1);
    } else {
      throw new Error("Invalid response format from API.");
    }
  } catch (error) {
    console.error("Error generating kaomoji variations:", error);
    throw new Error("Failed to generate kaomoji variations. Please try again.");
  }
};

export const generateKaomojiDescription = async (kaomoji: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a short, creative description for the kaomoji "${kaomoji}". Explain its likely meaning, emotion, and common usage scenarios in 1-2 sentences. Your response must be a JSON object with a single key "description" containing the description string.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: {
              type: Type.STRING,
              description: "The generated kaomoji description.",
            },
          },
        },
        temperature: 0.7,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    if (result && result.description && typeof result.description === 'string') {
        return result.description;
    } else {
        throw new Error("Invalid response format from API for description.");
    }
  } catch (error) {
    console.error("Error generating kaomoji description:", error);
    throw new Error("Failed to generate description. Please try again.");
  }
};