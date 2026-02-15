const jwt = require("jsonwebtoken");
const User = require("../models/User");

    const Authentication = async (req, res, next) => {
        
     try {
       const token = req.cookies.refreshToken;
       console.log("Token",token)

       if (!token) {
             return res.status(401).json({ message: "Unauthorized User" });
       }
       const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");
        console.log("decoded",decoded)
       req.user = await User.findById(decoded.userId);
       next();
     } catch (error) {
        
       return res.status(401).json({ message: "Unauthorized" });
     }

   }

   module.exports = Authentication