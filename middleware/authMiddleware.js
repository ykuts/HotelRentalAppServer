const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    console.log("Checking authorization");
    console.log("Headers:", req.headers);
    
    const token = req.cookies.jwt;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
      console.log("Token from header:", token ? "Received" : "Empty");
    }
    
    if (!token) {
      console.log("Token is empty");
      return res.status(400).json({ message: "no token" });
    }

    //verify the token
    const data = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token cheked, User ID:", data.id);
    const user= await User.findById(data.id);
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "invalid user" });
    }

    req.user=user;

   next();
} catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: " NO Token " });
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
