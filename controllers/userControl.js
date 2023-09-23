const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongoDBid');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');

exports.createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    // Search for a user with the given email
    const findUser = await User.findOne({ email:email });
    
    if (!findUser) {
      // Create a new user
      const newUser = new User(req.body);
      await newUser.save();  // Save the new user to the database
      res.json(newUser);
    } else {
      // User Already Exists
        throw new Error("User Already Exists");
    }
});

exports.loginUser = asyncHandler(async (req,res) => {
    const { email, password } = req.body;
    // check if user exists or not
    const findUser = await User.findOne({ email:email});
    if (findUser && (await findUser.isPasswordMatched(password))) {
        // refresh token
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateuser = await User.findOneAndUpdate(
            findUser?._id,
        {
            refreshToken: refreshToken,
        },{
            new: true
        });
        res.cookie('refreshToken',refreshToken,{
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
            
        });
    } else {
        throw new Error("Invalid Credentials");
    }; 
});

// Get All Users

exports.getAllUsers = asyncHandler( async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        throw new Error(error)
    }
});

// Get a single user

exports.getUsers = asyncHandler( async(req,res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getUser = await User.findById(id);
        res.json(getUser);
    } catch (error) {
        throw new Error(error)
    }
});

// Delete a user

exports.deleteUsers = asyncHandler( async(req,res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        res.json(deleteUser);
    } catch(error) {
        throw new Error(error) 

    }
});

// Update a user

exports.updateUsers = asyncHandler( async(req,res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const updateUser = await User.findByIdAndUpdate(_id,{
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        },
        {
            new: true,
        });
        res.json(updateUser);
    } catch(error) {
        throw new Error(error);
    }
});

// block user

exports.blockUser = asyncHandler(async(req,res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const block = await User.findByIdAndUpdate(id,{
            isBlocked:true,
        },{
            new:true,
        });
        res.json(block)
    } catch (error){
        throw new Error(error)
    }
});

// unblock user

exports.unblockUser = asyncHandler(async(req,res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const unblock = await User.findByIdAndUpdate(id,{
            isBlocked:false,
        },{
            new:true,
        });
        res.json({
            message: "User Unblocked",
        })
    } catch (error){
        throw new Error(error)
    }
});

// handle Refresh token

exports.handleRefreshToken = asyncHandler(async (req,res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({
        refreshToken
    });
    if (!user) throw new Error('No Refresh Token present in Database or not matched');
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error('There is something wrong with refresh token');
        } 
        const accessToken = generateToken(user?._id)
        res.json({ accessToken });
    });
    res.json(user);
});

// logout user

exports.logout = asyncHandler (async(req,res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:true,
        });
        return res.sendStatus(204); //forbidden
    }
    await User.findOneAndUpdate({ refreshToken: refreshToken }, {
    refreshToken: "",
    });

    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true,
    });
    return res.sendStatus(204); //forbidden
});