const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", // سيرفر Brevo العالمي المفتوح على ريلواي
  port: 587, // البورت المعتمد والشغال دايماً
  secure: false, // false للـ TLS
  auth: {
    user: "ahmed.emad.soliman.me@gmail.com", // سيب إيميلك هنا عادي
    pass: process.env.BREVO_KEY, // ⚠️ المفتاح السحري اللي هنجيبه حالا
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendemail({ to, subject, text }) {
  try {
    const info = await transporter.sendMail({
      from: '"Social Media Platform" <ahmed.emad.soliman.me@gmail.com>', // إيميلك الموثق
      to: to,
      subject: subject,
      text: text,
    });
    console.log("🔥 OTP Sent via Brevo Successfully!");
  } catch (err) {
    console.log("❌ Error to send email:", err.message);
  }
}

module.exports = sendemail;
