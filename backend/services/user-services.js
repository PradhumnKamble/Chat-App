const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Otp = require("../models/otpModel");
const generateToken = require("../config/generateToken");
const mailsender = require("../config/email-config");
const bcrypt = require("bcryptjs");


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

// @description     Get contacts
// @route           GET /api/user/:id/contacts
// @access          Public
const getContacts =  asyncHandler( async (userId)=>{
    try {
      const contactsInfo = await User.findById(userId,'contacts')
                                  .populate("contacts" , "name email") ; 
      return contactsInfo ;
    } catch(error) {
      console.log(error);
      throw Error("Something Went Wrong") ;
    }
})

// @description     Post contacts
// @route           POST /api/user/:id/contacts
// @access          Public
const addToContacts =  asyncHandler( async (userId , contactId)=>{
    try {
      const {contacts} = await User.
            findByIdAndUpdate(userId,{ $push: { "contacts": contactId }},{new :true})
              .populate("contacts" , "name email") ; 
      
      return contacts ;
    } catch(error) {
      console.log(error);
      throw Error("Something Went Wrong") ;
    }
})


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

const changePassword = asyncHandler(async(email , password)=>{
  try {
    const salt = await bcrypt.genSalt(10);
    encryptedPassword = await bcrypt.hash(password, salt);
    const user = await User.findOneAndUpdate({email : email} , {password : encryptedPassword} ,{new:true});

    console.log(user) ;
    return true ;
  } catch(e) {
    console.log(e);
    throw new Error(e) ;
  }
})
const getAll = asyncHandler(async ()=>{
  try {
    const users = await User.find({},'_id name email') ; 
    return users ;
    
  } catch(e) {
      console.log(e);
      throw new Error("Something went wrong")
  }
})

// generate otp
const generateOtp = (len) =>{
  return Math.pow(10 ,len-1) + Math.floor(Math.random()*9* Math.pow(10,len-1)) ;
}

const getOtp = async (email)=>{

  try{  
    // const user = await User.findOne({email});
    // if(!user) {
    //   throw new Error("User not registered");
    // }
    const otp = generateOtp(6);
    let res = await Otp.findOne({email:email}) ;
    if(!res)
       res = await Otp.create({email : email , otp : otp});
    else res = await Otp.findOneAndUpdate({email:email},{otp:otp},{new:true});
    console.log(res) ;

    const response = await mailsender.sendMail({
                      from: process.env.GMAIL_EMAIL,
                      to:email,
                      subject:"Mail from chat-app",
                      html:`The otp is ${otp}`
                    })
    return true ;

  }catch(error){
    console.log("error service " , error.message);
    if(!error.message)
      throw new Error("Something went wrong , Retry!!!");
    throw new Error(error)
  }
}

const verifyOtp = async (otp,email)=>{
  try {
    const response = await Otp.find({email:email}, 'otp');
    console.log("response" , response);
    if(!response){
      throw new Error("Otp expired");
    }
    if(+otp === response[0].otp) return true ;
    else 
    throw new Error("Otp did not match") ;
  } catch (error) {
    if(!error.message)
      throw new Error("Something went wrong , Retry!!!");
    throw new Error(error.message)
  }
}

module.exports = { 
  allUsers,registerUser, 
  authUser,getContacts,addToContacts,
  getAll, getOtp,verifyOtp ,changePassword
};
