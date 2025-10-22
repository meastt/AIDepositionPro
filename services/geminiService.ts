
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

const getApiKey = (): string => {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
        throw new Error("Gemini API key is not configured. Please set GEMINI_API_KEY in your .env.local file. Get your API key from https://aistudio.google.com/app/apikey");
    }
    return apiKey;
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        keyFactsAndAdmissions: {
            type: Type.ARRAY,
            description: "A list of critical facts and admissions made by the witness.",
            items: {
                type: Type.OBJECT,
                properties: {
                    fact: { type: Type.STRING, description: "The core statement or fact." },
                    witness: { type: Type.STRING, description: "The person who stated the fact." },
                    pageLine: { type: Type.STRING, description: "The page and line number where the fact is stated (e.g., 'Page 25, Line 10')." },
                    summary: { type: Type.STRING, description: "A brief summary of the importance of this fact." }
                },
                required: ["fact", "witness", "pageLine", "summary"]
            }
        },
        exhibitsReferenced: {
            type: Type.ARRAY,
            description: "A list of all exhibits mentioned or referenced in the transcript.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "The exhibit identifier (e.g., 'Exhibit 1', 'Plaintiff's Exhibit A')." },
                    description: { type: Type.STRING, description: "A brief description of what the exhibit is." },
                    pageLine: { type: Type.STRING, description: "The page and line number where the exhibit is first referenced." }
                },
                required: ["id", "description", "pageLine"]
            }
        },
        objectionsLog: {
            type: Type.ARRAY,
            description: "A log of all objections made during the deposition.",
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, description: "The type of objection (e.g., 'Hearsay', 'Leading', 'Form')." },
                    by: { type: Type.STRING, description: "The attorney or party who made the objection." },
                    ruling: { type: Type.STRING, description: "The judge's ruling, if stated (Sustained, Overruled, Not Stated)." },
                    pageLine: { type: Type.STRING, description: "The page and line number where the objection was made." }
                },
                required: ["type", "by", "ruling", "pageLine"]
            }
        }
    },
    required: ["keyFactsAndAdmissions", "exhibitsReferenced", "objectionsLog"]
};


export const analyzeTranscript = async (transcriptText: string): Promise<AnalysisResult> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Please analyze the following deposition transcript. Your task is to extract key information and structure it according to the provided JSON schema. Identify key facts and admissions, referenced exhibits, and a log of all objections.\n\nTRANSCRIPT:\n---\n${transcriptText}`,
            config: {
                systemInstruction: "You are a world-class paralegal AI with expertise in legal e-Discovery and deposition analysis. Your role is to meticulously review legal transcripts and extract structured data with high accuracy. Pay close attention to page and line numbers for all extracted items.",
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2, // Lower temperature for more deterministic, factual output
            },
        });
        
        const jsonText = response.text.trim();
        const result: AnalysisResult = JSON.parse(jsonText);
        return result;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get a valid analysis from the AI. The model may have returned an invalid response.");
    }
};
