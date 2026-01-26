const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  tuition: { type: Number }, // Annual tuition in USD
  ranking: { type: Number },
  acceptanceRate: { type: String }, // 'High', 'Medium', 'Low'
  minGpa: { type: Number }, // Minimum GPA required (scale of 4.0)
  programs: [{ type: String }] // e.g. ["Computer Science", "Data Science"]
});

module.exports = mongoose.model('University', universitySchema);