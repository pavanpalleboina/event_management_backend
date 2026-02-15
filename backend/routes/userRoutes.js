const express = require("express");
const { getProfile, login, signup, logoutUser } = require("../controllers/userController.js");
const  isAuth = require("../middleware/auth.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login); 
router.get("/profile", isAuth, getProfile);
router.post("/logout", isAuth, logoutUser);

module.exports = router;