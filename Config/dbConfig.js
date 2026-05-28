const mongoose = require("mongoose");

const Connetion = async function () {
  try {
    const Url = "mongodb://localhost:27017/Social";
    await mongoose.connect(Url);
    console.log("database Connected");
  } catch (error) {
    console.log(error);
  }
};
module.exports = { Connetion };
