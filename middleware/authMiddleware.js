const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    
    if (!token) {
      return res.status(400).json({ message: "no token" });
    }

    //verify the token
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const user= await User.findById(data.id);
    if (!user) {
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
