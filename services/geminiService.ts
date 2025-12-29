
import { GoogleGenAI, Type } from "@google/genai";
import { AIAdvice } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDBAAdvice = async (tableNames: string[]): Promise<AIAdvice> => {
  const prompt = `Analyze this list of database tables and provide professional DBA maintenance advice. 
  Tables: ${tableNames.join(", ")}
  
  Please provide:
  1. A summary of what these tables likely represent (e.g., application configuration, workflow engine, reporting).
  2. Specific recommendations for maintenance frequency.
  3. A risk assessment for running VACUUM FULL on these tables (considering potential locking issues).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendations: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            riskAssessment: { type: Type.STRING }
          },
          required: ["summary", "recommendations", "riskAssessment"]
        }
      }
    });

    return JSON.parse(response.text) as AIAdvice;
  } catch (error) {
    console.error("AI Advice Error:", error);
    return {
      summary: "Maintenance summary unavailable.",
      recommendations: ["Perform maintenance during off-peak hours.", "Ensure you have a recent backup."],
      riskAssessment: "VACUUM FULL will lock tables; use with caution in production."
    };
  }
};
