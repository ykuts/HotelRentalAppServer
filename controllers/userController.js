const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const JWT_SECRET = 'abc12345abc123';

const getUsers = async (req, res, next) => {
 try {
  const users = await User.find();
  if(!users){
    res.status(400);
    throw new Error("No users found");
  }
  return res.status(200).json(users);
 } catch (error) {
  next(error);
 }
};

const createUser = async (req, res, next) => {
  try {
    const { password, ...rest } = req.body;

    //generate salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ ...rest, password: hashedPassword });
    if (!user) {
      res.status(400);
      throw new Error("there was a problem creating user");
    }

    //hash password before saving the database

    const { password: userPassword, ...otherDetails } = user._doc;

    return res.status(201).json(otherDetails);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {

    //todo use joi to validate data;
   
    const { email, password } = req.body;

    //get user from database
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400);
      throw new Error("user not found");
    }

    //compare the password
    const isCorrect = await bcrypt.compare(password, user.password);

    if (!isCorrect) {
      res.status(400);
      throw new Error("incorrect password");
    }

    //generate a token
    //set cookie
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,
      { expiresIn: '7d' });

    res.cookie("jwt", token, { 
      httpOnly: true, 
      sameSite: 'none', 
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000);
    const { password: userPassword, ...rest } = user._doc;
    return res.status(200).json({ ...rest, token });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  res.cookie("jwt", " ", { expiresIn: "-1" });
  return res.json({ message: "you have been logged out" });
};

module.exports = {
  getUsers,
  createUser,
  loginUser,
  logoutUser,
};
