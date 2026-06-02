const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  pool: true, // 💡 تشغيل الـ Pool بيخلي الاتصال مستمر وميموتش من ريلواي
  host: "smtp.gmail.com", // رجعنا الاسم الرسمي
  port: 465, // هنقفل بورت 465 العادي ونخليه Secure تماماً
  secure: true, // true مع بورت 465
  auth: {
    user: "ahmed.emad.soliman.me@gmail.com",
    pass: process.env.PASS, // الـ App Password الـ 16 حرف
  },
  tls: {
    // 💡 إجبار السيرفر على عدم اشتراط شهادات أمان معقدة بتسبب الـ Timeout
    rejectUnauthorized: false,
    minVersion: "TLSv1.2",
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
    console.log("🔥 OTP Sent Successfully to:", to);
  } catch (err) {
    console.log("❌ Error to send email:", err.message);
  }
}

module.exports = sendemail;
