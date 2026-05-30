const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = "./uploads";

    console.log(req.originalUrl);
    if (req.originalUrl.includes("post")) {
      dest = "./uploads/posts";
    } else if (req.originalUrl.includes("auth")) {
      dest = "./uploads/users";
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
    cb(new Error("Unsupported file format"), false);
  }
};

module.exports = multer({ storage, fileFilter });
