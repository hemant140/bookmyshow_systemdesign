
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSystemDesignAdvice = async (query: string, history: { role: string, text: string }[] = []) => {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are a World-Class System Design Architect. 
    You are helping a user design a movie ticket booking system like "BookMyShow".
    
    Current System Overview:
    - Microservices: User, Movie, Booking, Payment, Notification.
    - Database: PostgreSQL (SQL) for Transactions, Redis for Distributed Locking, ElasticSearch for Search.
    - Strategy: Optimistic locking for seat selection.
    
    Answer the user's questions with high-level technical depth. Use markdown for lists and code blocks.
    Focus on scalability, availability, and concurrency issues (like double booking).
  `;

  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction,
    },
  });

  // Reconstruct history
  // Note: Gemini Chat API usually takes a different format for history but since we're using a simplified wrapper
  // We'll just pass the latest message if we want it simple, or iterate through.
  
  // For simplicity with this specific SDK's sendMessage:
  const response = await chat.sendMessage({ message: query });
  return response.text;
};
