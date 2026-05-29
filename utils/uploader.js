const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = path.join(__dirname, "../uploads/users/");

    if (req.originalUrl.includes("post")) {
      dest = path.join(__dirname, "../uploads/posts/");
    }

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    cb(null, dest);
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
    cb(
      new Error(
        "Unsupported file format. Only JPEG, PNG, and MP4 are allowed.",
      ),
      false,
    );
  }
};

const uploader = multer({ storage: storage, fileFilter: fileFilter });

module.exports = uploader;
