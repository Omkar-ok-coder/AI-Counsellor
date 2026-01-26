const University = require('../models/University');
const User = require('../models/User');

// @desc    Get Recommendations based on Profile
// @route   GET /api/universities
exports.getUniversities = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const userGpa = user.profile.gpa || 3.0; // Default if undefined

    // Filter logic (Simplified)
    const universities = await University.find({});

    // Add Logic for Dream/Target/Safe
    const taggedUniversities = universities.map((uni) => {
      let tag = 'Target';
      if (userGpa >= uni.minGpa + 0.4) tag = 'Safe';
      if (userGpa < uni.minGpa) tag = 'Dream';
      
      return { ...uni._doc, tag };
    });

    res.json(taggedUniversities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};