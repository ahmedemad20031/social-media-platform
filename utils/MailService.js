const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "ad5b9a001@smtp-brevo.com",
    pass: process.env.BREVO_PASS,
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
    console.log("🔥 OTP Sent via Brevo successfully to:", to);
  } catch (err) {
    console.log("❌ Error to send email:", err.message);
  }
}

module.exports = sendemail;
