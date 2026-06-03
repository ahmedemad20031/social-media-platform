const SibApiV3Sdk = require("@getbrevo/brevo");

const sendVerificationEmail = async (userEmail, otpCode) => {
  try {
    // 1. إعداد الـ Client وتمرير الـ API Key
    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    // 2. إنشاء نسخة من خدمة الإيميلات التفاعلية (Transactional Emails)
    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // 3. تجهيز بيانات الإيميل
    sendSmtpEmail.subject = "كود التحقق الخاص بحسابك 🎉";
    sendSmtpEmail.htmlContent = `
      <div style="font-family: sans-serif; direction: rtl; text-align: right; padding: 20px;">
        <h2>أهلاً بك في منصتنا!</h2>
        <p>شكراً لتسجيلك معنا. كود التحقق (OTP) الخاص بك هو:</p>
        <h1 style="color: #007bff; letter-spacing: 2px;">${otpCode}</h1>
        <p>هذا الكود صالح لفترة محدودة، برجاء عدم مشاركته مع أحد.</p>
      </div>
    `;

    // المرسل: يجب أن يكون إيميل حسابك في Brevo الذي سجلت به
    sendSmtpEmail.sender = {
      name: "Social Media App",
      email: "ahmedemad01101606994@gmail.com",
    };

    // المستقبل: إيميل المستخدم الذي يقوم بالتسجيل حالياً
    sendSmtpEmail.to = [{ email: userEmail }];

    // 4. إرسال الطلب
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email Sent via Brevo Successfully:", response.body);
    return true;
  } catch (error) {
    console.error("❌ Brevo Error:", error);
    return false;
  }
};

module.exports = sendVerificationEmail;
