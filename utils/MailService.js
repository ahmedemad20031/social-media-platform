const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "ahmed.emad.soliman.me@gmail.com",
    pass: "bozqqdfjhyjhdpsk",
  },
});

async function sendemail(email, message, title) {
  try {
    await transporter.sendMail({
      from: "ahmed.emad.soliman.me@gmail.com",
      to: email,
      subject: title,
      text: message,
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = sendemail;
