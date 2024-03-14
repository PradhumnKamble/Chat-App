import { FormControl } from "@chakra-ui/form-control";
import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull} from "../config/ChatLogics";
import Status from "../config/Status.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import  messIcon from "../images/message.svg"
import img from "../images/chatPageImage.svg"
import plane from "../images/plane.svg"  
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import EmojiPicker from 'emoji-picker-react';


const ENDPOINT = "http://localhost:5000"


var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  let [newMessage ,setNewMessage] = useState("") ;
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [emojiPickOpen, setEmojiPickOpen] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if ( (event.key === "Enter" || event.type=="click")  && newMessage)
     {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    // if (!typing) {
    //   setTyping(true);
    //   socket.emit("typing", selectedChat._id);
    // }
    // let lastTypingTime = new Date().getTime();
    // var timerLength = 3000;
    // setTimeout(() => {
    //   var timeNow = new Date().getTime();
    //   var timeDiff = timeNow - lastTypingTime;
    //   if (timeDiff >= timerLength && typing) {
    //     socket.emit("stop typing", selectedChat._id);
    //     setTyping(false);
    //   }
    // }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={2}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              sx ={{
                    position:'relative',
                    marginLeft :"0px"
                  }}
              icon={<ArrowBackIcon />}
              onClick={() => {
                setSelectedChat("");
                setFetchAgain(!fetchAgain) ;
              }}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  <Box sx ={{
                    position:'relative',
                    marginLeft :"5px"
                  }}>
                  <span>
                      {getSender(user, selectedChat.users)}  
                  </span>
                  <Status loggedUser = {user} users = {selectedChat.users}/>

                  </Box>
                  
                  <Box sx ={{
                    position:'relative',
                    marginRight :"0px"
                  }}>
                    
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                  </Box>
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            className ="chatbox"
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={2}
            // bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <Box display = {emojiPickOpen ?"flex": "none" }
               alignItems ="center" flexDirection = "column">

                <Box style = {{position : 'absolute' ,bottom : "10%" , right :"45%" , zIndex:999}}  >
                  
                    {/* <Button colorScheme = "telegram" onClick = {()=>{setEmojiPickOpen(!emojiPickOpen)}}> */}
                    {/*   Close */}
                    {/* </Button> */}
                    <EmojiPicker
                        open = {emojiPickOpen}
                        width = "100%" 
                        // style = {{position : "relative" , marginBottom : "10px"}}
                        onEmojiClick = {(emojiObj)=>{ 
                         setNewMessage(newMessage.concat(emojiObj.emoji)) ; 
                      }}/>        
                </Box>
            </Box>
            <Box display = "flex"  alignItems = "center">
              <Box>
                <Button colorScheme = "telegram" onClick = {()=>{setEmojiPickOpen(!emojiPickOpen)}}>
                  <i class="fa-sharp fa-solid fa-face-smile  fa-xl"></i>
                </Button>
              </Box>
              
            <FormControl
              height = "100%"
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={2}

            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                // variant="filled"
                bg="white"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              >
              </Input>
            </FormControl> 
            <Button _hover = {{backgroundColor :"gray" , color :"white"}} bg ="#414a4c"
            color = "white"
            onClick={sendMessage}>Send</Button>
           </Box>
          
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box  display="flex" flexDir="column" alignItems="center" justifyContent="center" h="100%" w= "100%" bg="#F8F8F8">

        <Box w="30%" h="30%" pt={10}><img src={img}/></Box>

          <Text fontSize="xl"  fontFamily="Work sans" h="40%" pt={10}>
          <Text fontSize="3xl">Start Chatting...</Text>
            Click on a user to chat
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
