import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";

// Use a more stable model version (1.5-flash is current best for cost/speed)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateRecipe = async (imageUrl) => {
  // 1. Configure the model with a System Instruction for strict output
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: "You are a professional chef and nutritionist. You only respond with valid JSON code. Do not include any conversational text or markdown formatting tags.",
  });

  // 2. Optimized Image Fetching
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  // 3. Structured Prompt with Schema Enforcement
  const prompt = `
    Analyze this food image. Provide a detailed recipe in the following JSON format:
    {
      "title": "Creative Name",
      "description": "Brief summary",
      "ingredients": ["item 1", "item 2"],
      "category": "Breakfast | Lunch | Dinner | Snack | Dessert | Drinks"
    }
  `;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: res.headers.get("content-type") || "image/jpeg",
          data: base64,
        },
      },
    ]);

    const responseText = result.response.text();

    // 4. Robust JSON Parsing (Removes potential markdown backticks)
    const cleanJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanJson);

  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to analyze image. Please try a different photo.");
  }
};

export default generateRecipe;