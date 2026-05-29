const multer = require("multer");
const fs = require("fs");
const path = require("path");

const BASE_DIR = process.cwd();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let targetDir = path.join(BASE_DIR, "uploads", "users");

    if (req.originalUrl.includes("post")) {
      targetDir = path.join(BASE_DIR, "uploads", "posts");
    }

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    cb(null, targetDir);
  },

  filename: function (req, file, cb) {
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
    cb(new Error("Unsupported file format"), false);
  }
};

module.exports = multer({ storage, fileFilter });
