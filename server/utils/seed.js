const mongoose = require('mongoose');
const dotenv = require('dotenv');
const University = require('../models/University');
const connectDB = require('../config/db');

dotenv.config(); // Load .env from root
connectDB();

const universities = [
  {
    name: 'Stanford University',
    location: 'Stanford, CA',
    country: 'United States',
    tuition: 58000,
    ranking: 3,
    acceptanceRate: 'Low',
    minGpa: 3.9,
    programs: ['Computer Science', 'Business']
  },
  {
    name: 'University of Toronto',
    location: 'Toronto, ON',
    country: 'Canada',
    tuition: 45000,
    ranking: 21,
    acceptanceRate: 'Medium',
    minGpa: 3.5,
    programs: ['Computer Science', 'Engineering']
  },
  {
    name: 'Technical University of Munich',
    location: 'Munich',
    country: 'Germany',
    tuition: 3000,
    ranking: 50,
    acceptanceRate: 'Medium',
    minGpa: 3.2,
    programs: ['Computer Science', 'Robotics']
  },
  {
    name: 'University of British Columbia',
    location: 'Vancouver, BC',
    country: 'Canada',
    tuition: 40000,
    ranking: 34,
    acceptanceRate: 'High',
    minGpa: 3.0,
    programs: ['Data Science', 'Arts']
  }
];

const importData = async () => {
  try {
    await University.deleteMany(); // Clear existing data
    await University.insertMany(universities);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();