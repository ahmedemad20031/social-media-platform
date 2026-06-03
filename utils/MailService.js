// سنستخدم fetch المدمجة في Node.js (متوفرة تلقائياً في Node 18 فما فوق)
// إذا كنت تستخدم إصداراً أقدم، يمكنك استخدام axios

const sendVerificationEmail = async (userEmail, otpCode) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY, // مفتاح الـ API الخاص بك في Railway
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Social Media App",
          email: "ahmedemad01101606994@gmail.com", // إيميل حسابك في Brevo
        },
        to: [
          {
            email: userEmail,
          },
        ],
        subject: "كود التحقق الخاص بحسابك 🎉",
        htmlContent: `
          <div style="font-family: sans-serif; direction: rtl; text-align: right; padding: 20px;">
            <h2>أهلاً بك في منصتنا!</h2>
            <p>شكراً لتسجيلك معنا. كود التحقق (OTP) الخاص بك هو:</p>
            <h1 style="color: #007bff; letter-spacing: 2px;">${otpCode}</h1>
            <p>هذا الكود صالح لفترة محدودة، برجاء عدم مشاركته مع أحد.</p>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Email Sent via Brevo API Successfully:", data);
      return true;
    } else {
      console.error("❌ Brevo API Error Response:", data);
      return false;
    }
  } catch (error) {
    console.error("❌ Network or Server Error in MailService:", error);
    return false;
  }
};

module.exports = sendVerificationEmail;
