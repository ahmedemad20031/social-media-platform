const User = require("../model/User");
const {
  registerValidation,
  loginValidation,
  verfiyValidation,
  recentpassword,
  forgetPasswordValidation,
  recentotpValidation,
} = require("../Validations/AuthValidations");
const bcrypt = require("bcrypt");
const generateOtp = require("otp-generator");
const sendemail = require("../utils/MailService");
const jwt = require("jsonwebtoken");

exports.register = async function (req, res) {
  try {
    // validation data
    const { error, value } = registerValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // check email
    const EmailExtise = await User.findOne({ email: value.email });
    if (EmailExtise) {
      return res.status(400).json({ message: "Email Already exists" });
    }

    const phoneExtise = await User.findOne({ phone: value.phone });
    if (phoneExtise) {
      return res.status(400).json({ message: "Phone Already exists" });
    }

    const profileImage = req.file ? req.file.path : req.body.profileImage;

    const hashPassword = await bcrypt.hash(value.password, 10);

    const user = new User({
      ...value,
      phone: value.phone,
      password: hashPassword,
      profileImage: profileImage,
    });

    const otp = generateOtp.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 2 * 60 * 1000);

    await user.save();

    await sendMail(value.email, "verfied", `otp is ${otp}`);

    return res.status(201).json({
      message: "registered successfully please verify your email before login",
      data: {
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          profileImage: user.profileImage,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.verify_otp = async function (req, res) {
  try {
    const { error, value } = verfiyValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: value.email });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const isExpired =
      !user.otpExpire || new Date(user.otpExpire).getTime() < Date.now();

    if (isExpired) {
      user.otp = null;
      user.otpExpire = null;
      await user.save();

      return res.status(401).json({ message: "Otp Expired" });
    }

    if (user.otp !== value.otp) {
      return res.status(400).json({ message: "Invalid Otp" });
    }

    user.otp = null;
    user.otpExpire = null;
    user.recentOtpCount = 0;

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    await user.save();

    return res.status(200).json({
      message: "verified successfully",
      data: {
        token,
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          profileImage: user.profileImage,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.login = async function (req, res) {
  try {
    const { error, value } = loginValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: value.email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (user.otp) {
      return res
        .status(403)
        .json({ message: "Please verify your email first" });
    }

    const isValid = await bcrypt.compare(value.password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Login successfully",
      data: {
        token,
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          profileImage: user.profileImage,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.recent_otp = async function (req, res) {
  try {
    const { error, value } = recentotpValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: value.email });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (
      user.otpLastSentAt &&
      Date.now() - new Date(user.otpLastSentAt).getTime() < 60 * 1000
    ) {
      return res.status(429).json({
        message: "Please wait 1 minute before requesting again",
      });
    }

    if ((user.recentOtpCount || 0) >= 5) {
      return res.status(429).json({ message: "OTP resend limit reached" });
    }

    const otp = generateOtp.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 2 * 60 * 1000);
    user.otpLastSentAt = new Date();
    user.recentOtpCount = (user.recentOtpCount || 0) + 1;

    await user.save();

    await sendMail(value.email, "verfied", `otp is ${otp}`);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.forgetpassword = async function (req, res) {
  try {
    const { error, value } = forgetPasswordValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: value.email });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (
      user.otpLastSentAt &&
      Date.now() - new Date(user.otpLastSentAt).getTime() < 60 * 1000
    ) {
      return res.status(429).json({
        message: "Please wait 1 minute before requesting again",
      });
    }

    if (user.otp) {
      return res
        .status(403)
        .json({ message: "Please verify your email first" });
    }

    const otp = generateOtp.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    user.forgetOtp = otp;
    user.forgetOtpExpire = new Date(Date.now() + 2 * 60 * 1000);
    user.otpLastSentAt = new Date(Date.now());

    await user.save();
    await sendMail(value.email, "verfied", `otp is ${otp}`);

    return res.status(200).json({ message: "Otp sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.resetpassword = async function (req, res) {
  try {
    const { error, value } = recentpassword.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: value.email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (
      !user.forgetOtpExpire ||
      new Date(user.forgetOtpExpire).getTime() < Date.now()
    ) {
      user.forgetOtp = null;
      user.forgetOtpExpire = null;
      await user.save();
      return res.status(400).json({ message: "Otp Expired" });
    }

    if (user.forgetOtp !== value.otp) {
      return res.status(400).json({ message: "Invalid Otp" });
    }

    const newPassword = await bcrypt.hash(value.password, 12);
    user.password = newPassword;

    user.forgetOtp = null;
    user.forgetOtpExpire = null;

    await user.save();
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.resendForgetOtp = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const otp = generateOtp.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    user.forgetOtp = otp;
    user.forgetOtpExpire = new Date(Date.now() + 2 * 60 * 1000);

    await user.save();

    await sendMail(value.email, "verfied", `otp is ${otp}`);
    return res.status(200).json({ message: "New OTP sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getme = async function (req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById({ _id: userId }).select(
      "-password -otp -otpExpire -otpLastSentAt",
    );
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    return res.status(200).json({ message: "User Found", data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.UpdateProfile = async function (req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById({ _id: userId }).select(
      "-password -otp -otpExpire -otpLastSentAt",
    );
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.phone = req.body.phone || user.phone;
    if (req.file) {
      user.profileImage = req.file.path;
    }

    await user.save();
    return res.status(200).json({ message: "User Updated", data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.logout = async function (req, res) {
  try {
    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getuser = async function (req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findById({ _id: userId }).select(
      "-password -otp -otpExpire -otpLastSentAt",
    );
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    return res.status(200).json({ message: "User Found", data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
