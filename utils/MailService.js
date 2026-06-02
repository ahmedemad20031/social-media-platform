const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "ahmed.emad.soliman.me@gmail.com",
    pass: process.env.PASS,
  },
  dns: {
    family: 4,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendemail({ to, subject, text }) {
  try {
    const info = await transporter.sendMail({
      from: '"Social Media Platform" <ahmed.emad.soliman.me@gmail.com>',
      to: to,
      subject: subject,
      text: text,
    });
    console.log("🔥 OTP sent successfully to:", to);
  } catch (err) {
    console.log("❌ Error to send email:", err.message);
  }
}

module.exports = sendemail;
