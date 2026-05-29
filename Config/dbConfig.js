const mongoose = require("mongoose");
require("dotenv").config();

const Connection = async function () {
  try {
    const Url = process.env.MONGO_URI;

    await mongoose.connect(Url);
    console.log("رابط قاعدة البيانات هو:", Url);

    console.log("database Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { Connection };
