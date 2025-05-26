import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// ✅ Correct way to initialize the client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.post("/api/ask", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // or "gemini-1.5-pro"
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Gemini API error" });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
