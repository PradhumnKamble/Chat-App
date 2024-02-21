const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (chatId) => {
  try {
    const messages = await Message.find({ chat:chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    
    return messages ;
  } catch (error) {
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (senderId ,data) => {
  const { content, chatId } = data;

  var newMessage = {
    sender: senderId,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

   await Chat.findByIdAndUpdate(chatId, { latestMessage: message },{new:true});
   return message;
  } catch (error) {
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
