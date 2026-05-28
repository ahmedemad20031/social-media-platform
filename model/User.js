const mongoose = require("mongoose");

const userschema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    profileImage: { type: String },

    otp: { type: String },
    otpExpire: { type: Date },

    forgetOtp: { type: String },
    forgetOtpExpire: { type: Date },

    recentOtp: { type: String },
    recentOtpCount: { type: Number },
    otpLastSentAt: { type: Date },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userschema);

module.exports = User;
