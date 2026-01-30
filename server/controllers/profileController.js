const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('shortlist.university');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile (Onboarding)
// @route   PUT /api/profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.profile = { ...user.profile, ...req.body };
      user.profileCreated = true;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};