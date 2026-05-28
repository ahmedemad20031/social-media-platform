const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.originalUrl.includes("post")) {
      cb(null, "uploads/posts/");
    } else {
      cb(null, "uploads/users/");
    }
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "video/mp4"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uplaoder = multer({ storage: storage, fileFilter });
// console.log(uplaoder);\""

module.exports = uplaoder;
