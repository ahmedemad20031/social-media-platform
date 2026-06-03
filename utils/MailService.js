// 1. استدعاء الكلاسات المطلوبة مباشرة من المكتبة
const { TransactionalEmailsApi, SendSmtpEmail } = require("@getbrevo/brevo");

const sendVerificationEmail = async (userEmail, otpCode) => {
  try {
    // 2. إنشاء نسخة من الـ API وتعيين الـ API Key مباشرة
    const apiInstance = new TransactionalEmailsApi();

    // ضبط مفتاح الـ API
    apiInstance.setApiKey(0, process.env.BREVO_API_KEY); // الرقم 0 يمثل معامل التوثيق الأول (apiKey)

    // 3. تجهيز بيانات الإيميل
    const sendSmtpEmail = new SendSmtpEmail();

    sendSmtpEmail.subject = "كود التحقق الخاص بحسابك 🎉";
    sendSmtpEmail.htmlContent = `
      <div style="font-family: sans-serif; direction: rtl; text-align: right; padding: 20px;">
        <h2>أهلاً بك في منصتنا!</h2>
        <p>شكراً لتسجيلك معنا. كود التحقق (OTP) الخاص بك هو:</p>
        <h1 style="color: #007bff; letter-spacing: 2px;">${otpCode}</h1>
        <p>هذا الكود صالح لفترة محدودة، برجاء عدم مشاركته مع أحد.</p>
      </div>
    `;

    // المرسل والمستقبل
    sendSmtpEmail.sender = {
      name: "Social Media App",
      email: "ahmedemad01101606994@gmail.com",
    };
    sendSmtpEmail.to = [{ email: userEmail }];

    // 4. إرسال الطلب
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email Sent via Brevo Successfully:", response.body);
    return true;
  } catch (error) {
    console.error(
      "❌ Brevo Error Details:",
      error.response ? error.response.body : error,
    );
    return false;
  }
};

module.exports = sendVerificationEmail;
