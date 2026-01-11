
import { GoogleGenAI } from "@google/genai";

export async function generateBlueprint(prompt: string) {
  // Always use a named parameter to initialize the client
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });

    // Directly access the .text property from the GenerateContentResponse object
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
