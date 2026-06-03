const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "ahmed.emad.soliman.me@gmail.com",
    pass: process.env.APP_PASS,
  },
});

async function sendemail(email, message, title) {
  try {
    await transporter.verify();
    console.log("✅ Gmail SMTP Connected");

    const info = await transporter.sendMail({
      from: "ahmed.emad.soliman.me@gmail.com",
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
