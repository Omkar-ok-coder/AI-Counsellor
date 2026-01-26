const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Profile Information
  profile: {
    educationLevel: { type: String, default: "Bachelor's Degree" },
    major: { type: String, default: 'Computer Science' },
    gpa: { type: Number },
    graduationYear: { type: Number },
    targetDegree: { type: String, default: "Master's" },
    preferredCountries: [{ type: String }],
    budgetRange: { type: String },
  },

  // Shortlisted Universities
  shortlist: [{
    university: { type: mongoose.Schema.Types.ObjectId, ref: 'University' },
    status: { type: String, enum: ['shortlisted', 'locked', 'applied'], default: 'shortlisted' },
    tag: { type: String } // 'dream', 'target', 'safe'
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);