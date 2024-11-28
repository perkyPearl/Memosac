const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateJwtToken = (userData) => {
  if (!process.env.PRIVATE_KEY) {
    console.error("JWT private key is missing from .env");
    throw new Error("JWT private key is missing");
  }

  return jwt.sign(userData, process.env.PRIVATE_KEY, { expiresIn: "1h" });
};

const validateJwtToken = (req, res, next) => {
  console.log("Authorization Header:", req.headers.authorization);

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    console.error("Missing or invalid Authorization header");

    return res.status(401).json({ error: "Invalid Authorization format" });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.error("Invalid token format");
    return res.status(401).json({ error: "Invalid token format" });
  }

  try {
    console.log("JWT Private Key:", process.env.PRIVATE_KEY);

    if (!process.env.PRIVATE_KEY) {
      console.error("JWT private key is missing from .env");
      throw new Error("JWT private key is missing");
    }

    const validatedToken = jwt.verify(token, process.env.PRIVATE_KEY);
    console.log("Decoded token:", validatedToken);
    req.user = validatedToken;
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res
      .status(401)
      .json({ error: "Token verification failed", message: err.message });
  }
};

module.exports = { generateJwtToken, validateJwtToken };
