const Brevo = require("@getbrevo/brevo");

const sendVerificationEmail = async (userEmail, otpCode) => {
  try {
    // 1. إعداد الـ Client مباشرة باستخدام الـ API Key
    let apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY,
    );

    // 2. تجهيز بيانات الإيميل
    let sendSmtpEmail = new Brevo.SendSmtpEmail();

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

    // 3. إرسال الطلب بالطريقة الجديدة
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email Sent via Brevo Successfully:", response.body);
    return true;
  } catch (error) {
    console.error("❌ Brevo Error:", error);
    return false;
  }
};

module.exports = sendVerificationEmail;
