const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

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
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        res.json(deleteUser);
    } catch(error) {
        throw new Error(error) 

    }
});

// Update a user

exports.updateUsers = asyncHandler( async(req,res) => {
    const { id } = req.params;
    try {
        const updateUser = await User.findByIdAndUpdate(id,{
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