const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
let model = null;

const initializeGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim() !== '') {
    try {
      genAI = new GoogleGenerativeAI(apiKey);
      model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      console.log('✨ Google Gemini AI Client initialized successfully.');
      return true;
    } catch (err) {
      console.warn(`⚠️ Failed to initialize Google Gemini API: ${err.message}`);
    }
  }
  return false;
};

// Generate content via Gemini or fallback
const generateAIContent = async (prompt, systemInstruction = '') => {
  if (!model) {
    initializeGemini();
  }

  if (model) {
    try {
      const fullPrompt = systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt;
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.warn(`⚠️ Gemini API call failed, switching to heuristic AI engine: ${error.message}`);
    }
  }

  return null; // Fallback to heuristic engines in callers
};

module.exports = {
  initializeGemini,
  generateAIContent
};
