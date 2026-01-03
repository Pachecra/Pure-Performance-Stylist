import { GoogleGenAI, Chat, Part } from "@google/genai";
import { SYSTEM_PROMPT } from "../types";

// Initialize the client
// Ensure API key is present
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}
const ai = new GoogleGenAI({ apiKey: apiKey });

// We keep a reference to the chat session instance
let chatSession: Chat | null = null;

const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview', // Updated to the latest stable preview model
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7, 
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (
  text: string,
  imageBase64?: string
): Promise<string> => {
  try {
    const chat = getChatSession();

    // Prepare content parts
    const parts: Part[] = [];
    
    // Add image if present
    if (imageBase64) {
      // Extract base64 data (remove data:image/xxx;base64, prefix if present)
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg', 
          data: base64Data,
        },
      });
    }

    // Add text if present (or default prompt if only image is sent)
    if (text) {
      parts.push({ text });
    } else if (parts.length > 0 && !text) {
      parts.push({ text: "Bitte analysieren Sie diesen Look." });
    }

    // Send message using the correct API format for chat
    const response = await chat.sendMessage({
      message: { 
        role: 'user', 
        parts: parts 
      }
    });

    return response.text || "Entschuldigung, ich konnte darauf keine Antwort generieren.";
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    // Reset session on error to prevent stuck state
    chatSession = null;
    return "Es ist ein Fehler aufgetreten. Bitte überprüfen Sie Ihre Verbindung oder versuchen Sie es erneut.";
  }
};