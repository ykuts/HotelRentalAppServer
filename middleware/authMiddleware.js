const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    console.log("Checking authorization");
    console.log("Headers:", req.headers);
    
    let token = null;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
      console.log("Token from header:", token ? "Received" : "Empty");
    }
    
   if (!token && req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
      console.log("Token from cookies:", token ? "Present" : "Missing");
    }
    
    if (!token) {
      console.log("No token found");
      return res.status(401).json({ message: "No token provided" });
    }

    //verify the token
    try {
      // Проверка токена
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token verified, user ID:", decoded.id);
      
      // Поиск пользователя
      const user = await User.findById(decoded.id);
      if (!user) {
        console.log("User not found in database");
        return res.status(401).json({ message: "User not found" });
      }
      
      console.log("User authenticated:", user.email, "isAdmin:", user.isAdmin);
      req.user = user;
      next();
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError.message);
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
const logoutUser=async (req, res, next) => {
  res.cookie("jwt", "", { expiresIn:"-1"});
  return res.json({ message: "you have been logged out" });
};

module.exports = {
  auth,
  logoutUser,
};
