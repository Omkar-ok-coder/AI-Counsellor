const mongoose = require('mongoose');
const dotenv = require('dotenv');

// ✅ FIXED PATHS: Go up one level (..) to find models and config
const University = require('../models/University'); 
const connectDB = require('../config/db'); 

// Load environment variables (assuming .env is in the root server folder)
dotenv.config({ path: '../.env' });

// Connect to MongoDB
connectDB();

// --- DATA GENERATION HELPERS ---
const sampleData = {
  countries: [
    { name: "United States", cities: ["Boston", "New York", "San Francisco", "Austin", "Chicago", "Los Angeles", "Seattle", "Atlanta", "Miami"] },
    { name: "United Kingdom", cities: ["London", "Manchester", "Edinburgh", "Oxford", "Cambridge", "Bristol", "Glasgow"] },
    { name: "Canada", cities: ["Toronto", "Vancouver", "Montreal", "Waterloo", "Ottawa", "Calgary", "Edmonton"] },
    { name: "Australia", cities: ["Melbourne", "Sydney", "Brisbane", "Perth", "Adelaide", "Canberra"] },
    { name: "Germany", cities: ["Berlin", "Munich", "Hamburg", "Aachen", "Heidelberg", "Frankfurt", "Stuttgart"] }
  ],
  prefixes: ["University of", "Institute of", "State University of", "National College of", "City University of", "Technical University of"],
  suffixes: ["Technology", "Science", "Arts", "Management", "Engineering", "Business School"],
  programs: [
    "Computer Science", "Data Science", "Business Administration", "Mechanical Engineering", 
    "Psychology", "Economics", "Civil Engineering", "Artificial Intelligence", 
    "Biotechnology", "Finance", "Marketing", "Cybersecurity", "Architecture"
  ]
};

const generateUniversities = (count) => {
  const universities = [];

  for (let i = 0; i < count; i++) {
    const countryObj = sampleData.countries[Math.floor(Math.random() * sampleData.countries.length)];
    const city = countryObj.cities[Math.floor(Math.random() * countryObj.cities.length)];
    const country = countryObj.name;

    let name;
    if (Math.random() > 0.5) {
      name = `${sampleData.prefixes[Math.floor(Math.random() * sampleData.prefixes.length)]} ${city}`;
    } else {
      name = `${city} ${sampleData.suffixes[Math.floor(Math.random() * sampleData.suffixes.length)]}`;
    }

    const ranking = i + 1;
    let tuitionBase = 15000;
    if (country === "Germany") tuitionBase = 500;
    else if (country === "United States") tuitionBase = 40000;
    
    const tuition = Math.floor(tuitionBase + Math.random() * 20000);

    let acceptanceRate = "High";
    let minGpa = 2.5;
    if (ranking <= 20) { acceptanceRate = "Low"; minGpa = 3.8; } 
    else if (ranking <= 50) { acceptanceRate = "Medium"; minGpa = 3.2; }

    const shuffledPrograms = sampleData.programs.sort(() => 0.5 - Math.random());
    const selectedPrograms = shuffledPrograms.slice(0, 3);

    universities.push({
      name: name,
      location: city, 
      country: country,
      tuition: tuition,
      ranking: ranking,
      acceptanceRate: acceptanceRate,
      minGpa: minGpa,
      programs: selectedPrograms,
      tag: ranking <= 25 ? "Dream" : ranking <= 75 ? "Target" : "Safe"
    });
  }
  return universities;
};

const importData = async () => {
  try {
    // 1. Clear existing universities
    await University.deleteMany();
    console.log('🔥 Old University Data Destroyed...');

    // 2. Generate 100 Universities
    const universities = generateUniversities(100);

    // 3. Insert new data
    await University.insertMany(universities);
    console.log(`✅ Successfully Imported ${universities.length} Universities!`);

    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();