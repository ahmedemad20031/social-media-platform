const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = "uploads/users/";

    if (req.originalUrl.includes("post")) {
      dest = "uploads/posts/";
    }

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    cb(null, dest);
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
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
    cb(new Error(" Not foundJPEG, PNG, MP4"), false);
  }
};
const uploader = multer({ storage: storage, fileFilter: fileFilter });

module.exports = uploader;
