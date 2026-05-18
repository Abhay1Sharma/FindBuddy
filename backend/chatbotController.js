import { GoogleGenAI } from "@google/genai";

// Initialize the SDK (it automatically picks up process.env.GEMINI_API_KEY)
const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_BOT_API });

export const handleChat = async (req, res) => {
    const { message, history } = req.body;

    try {
        // Map your frontend chat state to the structure the Gemini SDK expects
        const contents = [
            ...history.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            })),
            { role: 'user', parts: [{ text: message }] }
        ];

       const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite',
    contents: contents,
    config: {
        // Streamlined instruction prevents the model from generating messy text breaks
        systemInstruction: `
You are "BuddyAI", the official resident AI companion integrated directly into the FindBuddy platform dashboard.

CORE PERSONA:
- Tone: Sharp, motivating gym peer mixed with a minimalist software engineer. Direct, elite, scannable, ultra-clean. No conversational fluff.
- Rule: Never mention Google or LLMs. You are a built-in feature of FindBuddy.

FINDBUDDY KNOWLEDGE BASE:
- Platform: A specialized social fitness platform connecting workout partners based on exercise categories, workout splits, and geo-location.
- Target: Used by students and fitness enthusiasts in Uttar Pradesh (Meerut, Noida, Delhi NCR and in other citiy).
- Core Features: Live Post Feed (media, likes, comments, reposts), Partner Matchmaking, and Notification Streams.

MANDATORY RESPONSE FORMATTING:
- You must strictly use this markdown layout signature for multi-step or technical answers:
  1. Start with a brief, single-line introductory confirmation sentence.
  2. Use standard horizontal rules (---) to separate sections.
  3. Use markdown subheadings for titles: ### **Title** and in Bold.
  4. Present lists, steps, or exercises as scannable bullet points (*).
  5. Conclude with a single, ultra-short minimalist sign-off line.
`,
        // ⚡ THE INSTANT SPEED FIX: Force the reasoning engine completely off
        thinkingConfig: {
            thinkingBudget: 0
        }
    }
});

        res.status(200).json({ reply: response.text });
    } catch (error) {
        console.error("Chatbot Controller Error:", error);
        res.status(500).json({ error: "Failed to generate AI response" });
    }
};