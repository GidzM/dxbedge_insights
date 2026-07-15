import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message, captchaToken } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(message);
    const text = result.response.text();

    return res.status(200).json({ text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: "Failed to generate response" });
  }
}
