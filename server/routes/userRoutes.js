const { Router } = require("express");
const { getUsers, createUser, loginUser} = require("../controllers/userController");
const { logoutUser, auth } = require("../middleware/authMiddleware");


const router = Router();

// get all users
router.get("/",auth, getUsers);

//create a new user
router.post("/", createUser);

//login a user
router.post("/login", loginUser);

//logout  user
router.get("/logout", logoutUser);

module.exports = router;