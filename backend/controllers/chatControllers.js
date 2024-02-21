const asyncHandler = require("express-async-handler");
const {ChatService} = require("../services")
//@description     Create or fetch One to One Chat (while searching)
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {

  if(!req.body.userId) {
    // console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }
  try{
    const chat = await ChatService.accessChat(req.user,req.body) ;
    return  res.status(200).json(chat)
  }
  catch(error){
    res.status(400);
    throw new Error(error.message);
  }

} );

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => {

 try{
    const chats = await ChatService.fetchChats(req.user._id) ;
    return  res.status(200).json(chats);
  }
  catch(error){
    res.status(400);
    throw new Error(error.message);
  }

  
});

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req, res) => {
   /// middleware --->
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }
  /// <---- middleware

   try{
    const groupChat = await ChatService.createGroupChat(req.user , req.body) ;
    return  res.status(200).json(groupChat);
  }
  catch(error){
    res.status(400);
    throw new Error(error.message);
  } 
 
});

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
   try{
    const updatedChat = await ChatService.renameGroup(req.body) ;
    return  res.status(200).json(updatedChat);
  }
  catch(error){
    res.status(400);
    throw new Error(error.message);
  } 
});

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {

    try{
      const result = await ChatService.removeFromGroup(req.body) ;
      return  res.status(200).json(result);
    }
    catch(error){
      res.status(400);  
      throw new Error(error.message);
    } 
});

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
   try{
      const result = await ChatService.addToGroup(req.body) ;
      return  res.status(200).json(result);
    }
    catch(error){
      res.status(400);  
      throw new Error(error.message);
    } 
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};