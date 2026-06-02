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
    console.log("BREVO_PASS:", process.env.BREVO_PASS ? "FOUND" : "NOT FOUND");

    await transporter.verify();
    console.log("✅ SMTP Connected Successfully");

    const info = await transporter.sendMail({
      from: '"Social Media Platform" <ahmed.emad.soliman.me@gmail.com>',
      to,
      subject,
      text,
    });

    console.log("🔥 OTP Sent Successfully");
    console.log("Message ID:", info.messageId);

    return true;
  } catch (err) {
    console.error("❌ Email Error:");
    console.error(err);

    return false;
  }
}

module.exports = sendemail;
