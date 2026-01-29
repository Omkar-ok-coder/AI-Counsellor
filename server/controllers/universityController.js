const mongoose = require('mongoose');
const University = require('../models/University');
const User = require('../models/User');

// --- HELPER FUNCTION ---
// Merges user's shortlist status (locked/shortlisted) into the list of universities
const attachShortlistStatus = (universities, user) => {
  const shortlistMap = new Map();

  if (user && Array.isArray(user.shortlist)) {
    user.shortlist.forEach((item) => {
      if (item.university) {
        shortlistMap.set(item.university.toString(), item);
      }
    });
  }

  return universities.map((uni) => {
    const uniId =
      uni && uni._id && typeof uni._id.toString === 'function'
        ? uni._id.toString()
        : null;

    const shortlistEntry = uniId ? shortlistMap.get(uniId) : null;
    const status = shortlistEntry?.status || null;

    return {
      // `uni` is already a plain object at this point
      ...uni,
      isShortlisted: status === 'shortlisted' || status === 'locked' || status === 'applied',
      isLocked: status === 'locked',
    };
  });
};

// @desc    Get All Recommendations (Smart Logic + No Limit)
// @route   GET /api/universities/recommendations
exports.getRecommendations = async (req, res) => {
  try {
    // 1. Get the User to check their GPA
    const user = await User.findById(req.user._id);
    const userGpa = user?.profile?.gpa || 3.0; // Default to 3.0 if undefined

    // 2. Fetch ALL universities (No .limit() here!)
    const universities = await University.find({});

    console.log(`📊 Sending ${universities.length} universities to frontend...`);

    // 3. Add Logic for Dream/Target/Safe tags
    const taggedUniversities = universities.map((uni) => {
      let tag = 'Target';
      
      // Compare User GPA vs University Min GPA
      if (typeof uni.minGpa === 'number') {
        if (userGpa >= uni.minGpa + 0.4) tag = 'Safe';
        if (userGpa < uni.minGpa) tag = 'Dream';
      }

      // Convert Mongoose object to plain JSON object
      const plain = uni.toObject();
      return { ...plain, tag };
    });

    // 4. Attach "isShortlisted" and "isLocked" status
    const finalData = attachShortlistStatus(taggedUniversities, user);

    res.json(finalData);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update shortlist / lock status for a university
// @route   POST /api/universities/shortlist
// @access  Private
exports.updateShortlistStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { universityId, status, tag } = req.body;

    if (!universityId || !status) {
      return res.status(400).json({ message: 'universityId and status are required' });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(universityId)) {
      return res.status(400).json({ message: 'Invalid universityId' });
    }

    const allowedStatuses = ['shortlisted', 'locked', 'applied', 'removed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clean up invalid/legacy entries
    user.shortlist = user.shortlist.filter((item) =>
      mongoose.Types.ObjectId.isValid(item.university)
    );

    const existingIndex = user.shortlist.findIndex(
      (item) => item.university.toString() === universityId
    );

    if (status === 'removed') {
      if (existingIndex !== -1) {
        user.shortlist.splice(existingIndex, 1);
      }
    } else {
      // Add or Update
      if (existingIndex === -1) {
        user.shortlist.push({
          university: universityId,
          status,
          tag: tag || undefined,
        });
      } else {
        user.shortlist[existingIndex].status = status;
        if (tag) {
          user.shortlist[existingIndex].tag = tag;
        }
      }
    }

    await user.save();

    res.json({ message: 'Shortlist updated successfully' });
  } catch (error) {
    console.error("Shortlist Update Error:", error);
    res.status(500).json({ message: error.message });
  }
};