const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // باستخدام path.resolve و ".." نخرج خطوة واحدة من مجلد middlewares إلى المجلد الرئيسي
    // ثم ننشئ مجلد uploads بداخله بشكل مضمون تماماً على السيرفر
    let targetDir = path.resolve(__dirname, "..", "uploads", "users");

    if (req.originalUrl.includes("post")) {
      targetDir = path.resolve(__dirname, "..", "uploads", "posts");
    }

    // التأكد من إنشاء المجلد إذا لم يكن موجوداً
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    cb(null, targetDir);
  },

  filename: function (req, file, cb) {
    // تنظيف اسم الملف من المسافات لمنع مشاكل الروابط
    const cleanFileName = file.originalname.replace(/\s+/g, "_");
    cb(null, Date.now() + "_" + cleanFileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "video/mp4"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Unsupported file format. Only JPEG, PNG, and MP4 are allowed.",
      ),
      false,
    );
  }
};

const uploader = multer({ storage: storage, fileFilter: fileFilter });

// تصدير الـ uploader لاستخدامه في ملفات الـ Routes
module.exports = uploader;
