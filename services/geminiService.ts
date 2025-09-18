
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quizSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: 'The question text.',
      },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'An array of 4 possible answers.',
      },
      correctAnswerIndex: {
        type: Type.INTEGER,
        description: 'The 0-based index of the correct answer in the options array.',
      },
    },
    required: ["question", "options", "correctAnswerIndex"],
  },
};

export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
  try {
    const prompt = `Generate a 5-question multiple-choice quiz about "${topic}". Each question should have 4 options. Ensure the correctAnswerIndex is the correct 0-based index.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      },
    });

    const jsonText = response.text.trim();
    const quizData = JSON.parse(jsonText);

    if (Array.isArray(quizData)) {
      return quizData as QuizQuestion[];
    }
    throw new Error("Invalid data format received from API.");

  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz. Please check the topic and try again.");
  }
};
