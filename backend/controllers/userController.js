const User = require('../models/User.js');
 const bcrypt = require('bcryptjs');
 const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

 async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists with this email' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, passwordHash: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully',user:newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


 async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ message: 'Invalid Credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
     
     res.cookie("refreshToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ token, userId: user._id, username: user.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

 async function getProfile(req, res) {
  try {
   
    const userId = req.user
      
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


  const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res
      .status(200)
      .json({messege:"User logged out successfully"});
  } catch (error) {
     return res.status(500).json({ error: error.message });
  }
}



module.exports = { signup, login, getProfile, logoutUser };