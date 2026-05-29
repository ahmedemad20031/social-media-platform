// Config/dbConfig.js

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    await mongoose.connect(mongoURI, {
      retryWrites: true,
      w: "majority",
      ssl: true,
    });

    console.log("MongoDB Connected Successfully! 🎉");
  } catch (error) {
    console.error("Database connection failed: ", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
