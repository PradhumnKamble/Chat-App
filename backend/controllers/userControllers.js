const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { UserService} = require("../services") ;

// @description     Get or Search all users
// @route           GET /api/user?search=
// @access          Public
const allUsers = asyncHandler(async (req, res) => {

  try{
    const users = await UserService.allUsers(req.user,req.query) ;
    return  res.send(users);
  }
  catch(error){
    res.status(400);
    throw new Error(error.message);
  }
 
});
// @description     Get contacts
// @route           GET /api/user/:id/contacts
// @access          Public
const getContacts =  asyncHandler( async (req,res)=>{
    try {
      const contactsInfo = await UserService.getContacts(req.params.id) ; ; 
      return res.status(200).json(contactsInfo) ;
    } catch(error) {
      res.status(500);
      throw Error(error.message) ;
    }
})

// @description     Post contacts
// @route           POST /api/user/:id/contacts
// @access          Public
const addToContacts =  asyncHandler( async (req,res)=>{
    try {
      const contactsInfo = await UserService.addToContacts(req.params.id , 
        req.body.searcheduserId) ; 
      return res.status(200).json(contactsInfo) ;
    } catch(error) {
      res.status(500);
      throw Error(error.message) ;
    }
})


//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  
  try{
    const user = await UserService.registerUser(req.body) ;
    return  res.status(201).json(user);
  }
  catch(error){
    res.status(400);
    throw new Error(error.message);
  }

});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {

  try{
    const user = await UserService.authUser(req.body) ;
    return  res.status(200).json(user);
  }
  catch(error){
    res.status(400);
    throw new Error(error.message);
  }

});


// get all users
const getAll = asyncHandler(async (req,res)=>{
  try {
    const users = await UserService.getAll() ; 
    return res.status(200).json(users) ;
    
  } catch(e) {
      res.status(500) ;
      throw new Error(e.message) ;
  }
})

const getOtp = async (req,res)=>{
  // console.log(req.user.email)
  try {
    const response = await UserService.getOtp("kacsdprta@gmail.com") ;
    
    return res.status(200).json({message:"Otp has been sent to your email",data:response}) ;
    
  } catch (error) {
    res.status(500) ;
    throw new Error(error) ;
  }

}
const verifyOtp = async(req,res)=>{
  console.log("req body ",req.body)
  try {
    const response = await UserService.verifyOtp(req.body.otp ,req.body.email);
    if(response){
      return res.status(200).json("Success") ;
    }
  } catch (error) {
    res.status(500) ;
    throw new Error(error.message) ;
  }
}

module.exports = { allUsers,registerUser, authUser,getContacts,addToContacts,getAll,verifyOtp,getOtp};
