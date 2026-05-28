const mongoose = require("mongoose");
require("dotenv").config();

const Connetion = async function () {
  try {
    const Url = process.env.MONGO_URI;

    await mongoose.connect(Url);

    console.log("database Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { Connetion };
