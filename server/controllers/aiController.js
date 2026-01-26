// Note: You need an OpenAI API Key for this to work fully.
// This is a mock response version to save costs during dev.

exports.chatWithAI = async (req, res) => {
    const { message } = req.body;
    
    // Mock Logic: Return a static response for testing
    // Replace this with actual OpenAI API call later
    const botReply = `This is a simulated AI response. You asked: "${message}". Based on your profile, I recommend looking into scholarships in Germany.`;
    
    res.json({ reply: botReply });
  };