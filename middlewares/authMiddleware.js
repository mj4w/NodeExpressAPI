// verify the JWT Token 
const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

exports.authMiddleware = asyncHandler(async (req,res,next) => {
    let token;
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
        try {
            if (token) {
                const decoded = jwt.verify(token,process.env.JWT_SECRET);
                const user = await User.findById(decoded?.id);
                req.user = user;
                next();
            }
        } catch(error) {
            throw new Error('Not Authorized token expired, Please Login Again');
        }
    } else {
        throw new Error('There is no token attached to header');
    }
});

// check if user is admin
// next function use to passing the object

exports.isAdmin = asyncHandler(async (req,res,next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email });
    if (adminUser.role !== "admin"){
        throw new Error("You are not an Admin")
    } else {
        next();
    }
});

