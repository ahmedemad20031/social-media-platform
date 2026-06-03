const nodemailer = require("nodemailer");

require("dotenv").config();

console.log("EMAIL:", process.env.EMAIL);
console.log("APP_PASS:", process.env.APP_PASS ? "FOUND" : "NOT FOUND");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASS,
  },
});

async function sendemail(email, message, title) {
  try {
    await transporter.verify();
    console.log("✅ Gmail SMTP Connected");

    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: title,
      text: message,
    });

    console.log("✅ Email Sent");
    console.log("Message ID:", info.messageId);

    return true;
  } catch (err) {
    console.error("❌ Email Error:");
    console.error(err);

    return false;
  }
}

module.exports = sendemail;
