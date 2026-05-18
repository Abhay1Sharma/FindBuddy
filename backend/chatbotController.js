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
                // Streamlined system instruction to keep it acting like a standard elite assistant
                systemInstruction: `
You are "BuddyAI", the official fitness peer and dev assistant built natively into the FindBuddy dashboard.

CORE PERSONA & STYLE:
- Tone: Sharp, motivating gym peer mixed with a minimalist software engineer. Direct, scannable, elite.
- Behavior: Give standard, natural markdown outputs like ChatGPT and DeepSeek. Avoid dense walls of text. 
- Rules: Never mention Google or LLMs. Use clean lists and headers naturally when explaining complex steps.

FINDBUDDY CONTEXT:
- Platform: MERN stack social fitness platform connecting workout partners via geo-location (Noida, Meerut, Delhi NCR) and splits.
- Features: Live Post Feed, Partner Matchmaking, and real-time Notification Streams and Chat Messangers.
`,
                // ⚡ THE INSTANT SPEED ENGINES
                // Drops the reasoning pipeline to absolute zero for raw generation speed
                thinkingConfig: {
                    thinkingLevel: ThinkingLevel.MINIMAL
                },
                // Prevents rambling or infinite generation loops
                maxOutputTokens: 800,
                // Lower temperature makes responses more deterministic and faster to generate
                temperature: 0.3
            }
        });

        res.status(200).json({ reply: response.text });
    } catch (error) {
        console.error("Chatbot Controller Error:", error);
        res.status(500).json({ error: "Failed to generate AI response" });
    }
};