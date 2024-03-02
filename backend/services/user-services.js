const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

// @description     Get or Search all users
// @route           GET /api/user?search=
// @access          Public
const allUsers = asyncHandler(async (userId , query) => {
  const keyword = query.search
    ? {
        $or: [
          { name: { $regex: query.search, $options: "i" } },
          { email: { $regex: query.search, $options: "i" } },

        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: userId._id } });

  return users;
});


//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (data) => {
  const { name, email, password, pic } = data;

  if (!name || !email || !password) {
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    };
  } else {
    throw new Error("Unable to register the user");
  }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      contacts:user.contacts,
      token: generateToken(user._id) ,
    };

  } else {
    throw new Error("Invalid Email or Password");
  }
});

module.exports = { allUsers,registerUser, authUser};
