const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;

    // Get user profile for context
    const user = await User.findById(req.user._id);
    const userProfile = user.profile || {};

    // STRICT System Prompt
    const systemInstruction = `You are a strict, professional AI Study Abroad Counsellor.
    
    CRITICAL RULES:
    1. You MUST ONLY answer questions related to study abroad, career planning, university applications, profile building, and exams (GRE, IELTS, etc.).
    2. If the user asks about ANYTHING else (e.g., movies, politics, recipes, jokes, general life), you must POLITELY REFUSE and steer the conversation back to study abroad topics.
    3. ALWAYS use the user's specific profile data in your answers. Do not give generic advice if specific data is available.

    USER PROFILE DATA:
    - Name: ${user.name}
    - Education: ${userProfile.educationLevel} in ${userProfile.major} (GPA: ${userProfile.gpa})
    - Target: ${userProfile.targetDegree}
    - Countries: ${userProfile.preferredCountries?.join(', ')}
    - Budget: ${userProfile.budgetRange}
    - Status: IELTS (${userProfile.ieltsStatus}), GRE (${userProfile.greStatus})

    Provide concise, actionable advice. Format using Markdown.`;

    // Initialize model with system instruction
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction
    });

    // Convert frontend history to Gemini format
    // Frontend: { role: 'user' | 'assistant', content: string }
    // Gemini:   { role: 'user' | 'model', parts: [{ text: string }] }
    const chatHistory = (history || []).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Start Chat Session
    const chatSession = model.startChat({
      history: chatHistory,
    });

    // Send Message
    const result = await chatSession.sendMessage(message);
    const response = await result.response;
    const botReply = response.text();

    res.json({ reply: botReply });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      reply: "I apologize, but I'm having trouble connecting to the counselling service right now. Please try again in a moment."
    });
  }
};