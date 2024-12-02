import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCNTbB9KAiDcUfcd36j4BU8CP8dWqzvUgM";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    return result.response.text(); // Returning the text response
  } catch (error) {
    console.error("Error with AI model:", error);
    throw error;
  }
}

export default run;
