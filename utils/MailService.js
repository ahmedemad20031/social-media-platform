const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "ahmed.emad.soliman.me@gmail.com",
    pass: "bozqqdfjhyjhdpsk",
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
    console.log("otp sended ");
  } catch (err) {
    console.log("error to send email", err.message);
  }
}

module.exports = sendemail;
