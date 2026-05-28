//router
const router = require("express").Router();

const uploader = require("../utils/uploader");
// console.log(uploader);

//module
const AuthController = require("../Controllers/AuthController");

//middleware
const { AuthMiddleware } = require("../Middleware/AuthMiddleware");

//Get
router.get("/profile", AuthMiddleware, AuthController.getme);

router.get("/getuser/:id", AuthController.getuser);

//post
router.post(
  "/register",
  uploader.single("profileImage"),
  AuthController.register,
);
router.post("/verify_otp", AuthController.verify_otp);
router.post("/recent_otp", AuthController.recent_otp);
router.post("/login", AuthController.login);
router.post("/forgetPassword", AuthController.forgetpassword);
router.post("/resetPassword", AuthController.resetpassword);
router.post("/resendforgetotp", AuthController.resendForgetOtp);

//update
router.put(
  "/UpdateProfile",
  AuthMiddleware,
  uploader.single("profileImage"),
  AuthController.UpdateProfile,
);

router.delete("/logout", AuthMiddleware, AuthController.logout);

module.exports = router;
