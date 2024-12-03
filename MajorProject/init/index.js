const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
require("dotenv").config(); 

const MONGO_URL = process.env.MONGO_URL;

// Connect to the database
async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
    
    // Initialize the database after successful connection
    await initDB();
  } catch (err) {
    console.log("Error connecting to DB:", err);
  }
}

const initDB = async () => {
  try {
    // Clear existing listings
    await Listing.deleteMany({});

    // Update initData with the owner field
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: '670f881ce8a153195a021831',
    }));

    // Insert new data into the database
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
  } catch (err) {
    console.log("Error initializing data:", err);
  }
};

// Run the main function
main();
