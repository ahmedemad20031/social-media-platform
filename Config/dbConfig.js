// Config/dbConfig.js

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // نقرأ الرابط من متغيرات البيئة
    const mongoURI = process.env.MONGO_URI;

    await mongoose.connect(mongoURI, {
      // 🟢 هذه الخيارات تجبر السيرفر على الاتصال المباشر وتخطي مشاكل الـ DNS والـ ReplicaSet
      retryWrites: true,
      w: "majority",
      ssl: true,
      // إذا كنت تستخدم إصدارات قديمة قد تحتاجها، لكن في Mongoose 7+ الخيارات أعلاه كافية جداً
    });

    console.log("MongoDB Connected Successfully! 🎉");
  } catch (error) {
    console.error("Database connection failed: ", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
