const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    
    // Get user profile for context
    const user = await User.findById(req.user._id);
    const userProfile = user.profile || {};

    // Create a prompt with user context
    const systemPrompt = `You are an AI study abroad counsellor helping students with their study abroad journey. 
    
User Profile:
- Education Level: ${userProfile.educationLevel || 'Not specified'}
- Major: ${userProfile.major || 'Not specified'}
- GPA: ${userProfile.gpa || 'Not specified'}
- Target Degree: ${userProfile.targetDegree || 'Not specified'}
- Preferred Countries: ${userProfile.preferredCountries?.join(', ') || 'Not specified'}
- Budget Range: ${userProfile.budgetRange || 'Not specified'}

Provide helpful, personalized advice about study abroad, university recommendations, application processes, and profile improvement. Be concise but informative.`;

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Generate response
    const prompt = `${systemPrompt}\n\nUser Question: ${message}\n\nYour Response:`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const botReply = response.text();

    res.json({ reply: botReply });
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Fallback response if API fails
    const fallbackReply = `I apologize, but I'm having trouble processing your request right now. However, based on your profile, I recommend:
- Researching universities that match your academic background
- Preparing for required standardized tests (GRE/GMAT, IELTS/TOEFL)
- Working on your Statement of Purpose
- Exploring scholarship opportunities in your preferred countries

Please try asking your question again in a moment.`;
    
    res.json({ reply: fallbackReply });
  }
};