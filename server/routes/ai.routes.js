import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Ensure GEMINI_API_KEY is in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/refine-event', authenticateToken, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // Validation: Ensure at least some data is sent
    if (!title && !description) {
      return res.status(400).json({ error: 'Please provide at least a title or description.' });
    }

    // Using stable 1.5-flash for speed
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

    const structuredPrompt = `
      You are an expert event organizer for a college society.
      Refine the following event details into a professional, engaging, and clear description for the student body. 
      Use bullet points for key highlights or agenda. 
      Tone: High-energy, professional, and inviting.
      
      Event Title: ${title || 'Untitled Event'}
      Category: ${category || 'General'}
      Draft Details: ${description || 'No description provided.'}
    `;

    const result = await model.generateContent(structuredPrompt);
    const response = await result.response;
    const text = response.text();

    // Returning 'refinedText' to match what your frontend expects
    res.status(200).json({ refinedText: text.trim() });

  } catch (error) {
    console.error("Gemini AI Error:", error);
    res.status(500).json({ error: 'AI Service Error', details: error.message });
  }
});

export default router;