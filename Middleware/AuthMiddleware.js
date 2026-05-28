const jwt = require("jsonwebtoken");
const AuthMiddleware = async function (req, res, next) {
  try {
    const auth = req.headers?.authorization;

    if (!auth) {
      return res.status(401).json({ message: "No Token provider" });
    }

    const [type, token] = auth.split(" ");

    if (type !== "Bearer") {
      return res.status(401).json({ message: "Invalid Token" });
    }

    if (!token) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = payload;

    // console.log(req.user);

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { AuthMiddleware };
