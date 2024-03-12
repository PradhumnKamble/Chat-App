import { AddIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { Divider } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender,getSenderFull } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import "./styles.css";
const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState({});

  const { selectedChat, setSelectedChat, user, chats, setChats,} = ChatState();

  const toast = useToast();


  const getDateTime = (updatedAt) =>{
    let date = new Date(updatedAt) ; 

    if(date.toLocaleDateString() === (new Date().toLocaleDateString())){
      let hours = date.getHours() ;
      let minutes = date.getMinutes()  ;
      minutes = minutes > 9 ? minutes : ('0'+minutes) ; 
      let amPm = hours >= 12 ? 'PM' : 'AM' ;
      let rem  = hours%12  ; // 12 hr format
      hours = (rem === 0) ? 12 : rem ;
      return hours+':'+minutes+' '+ amPm;
    }
    else{
      const yyyy = date.getFullYear();
      let mm = date.getMonth() + 1; // Months start at 0!
      let dd = date.getDate();
      if (mm < 10) mm = '0' + mm;

      const formattedDate = dd + '/' + mm + '/' + yyyy;
      return formattedDate;
    } 
  }

  const fetchChats = async () => {

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const res = await axios.get("/api/chat", config);
      const { data } = res ;
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    
    <Box

      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      // p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      // borderRadius="lg"
      // borderWidth="1px"
    >
      <Box
        borderBottomWidth = {0.5}
        borderColor = "whitesmoke"
        mb={3}
        px={3}
        py={1}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
      >
        My Chats
        {/* <Divider width = {"100%"} borderColor = 'gray' mt = {1}/> */}
      </Box>
      <Box
    
        display="flex"
        flexDir="column"
        // p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        // borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll" spacing ={0}>
            {chats.map((chat) => (
              <Box
                borderBottomWidth = {1}
                borderColor = "whitesmoke"
                display="flex"
                flexDir="column"
                justifyContent= "space-between"
                // alignItems = "center"
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "white"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                // borderRadius="lg"
                key={chat._id}
              >
                <span>
                   <Avatar
                      mr={2}
                      size="sm"
                      cursor="pointer"
                      name={getSenderFull(loggedUser, chat.users).name}
                      src=
                      {!chat.isGroupChat?getSenderFull(loggedUser, chat.users).pic:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                      }
                   />
                   <span>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                   </span>
                </span>
                <div>  
                  {chat.latestMessage && (
                    <Box
                      display="flex"
                      justifyContent= "space-between"
                      alignItems = "center"
                    >
                      <Text fontSize="xs"
                        sx = {{
                          position :'relative',
                          marginLeft : '5px'
                        }}
                      >
                        {/* <b>{chat.latestMessage.sender.name} : </b> */}
                        <Text as = "b">
                          <Text as = "i" fontSize="xs">~Last Message</Text> 
                        </Text> :
                          { chat.latestMessage.content.length > 28
                            ? chat.latestMessage.content.substring(0, 29) + "..."
                            : chat.latestMessage.content
                          }
                      </Text>
                      <Text
                        sx = {{
                          position  : "relative" ,
                          marginRight :'5px',
                        }} 
                        fontSize = "xs" as ="b">{getDateTime(chat.updatedAt)}
                      </Text>
                    </Box>
                    )
                  
                  } 
                </div>
              {/* <Divider width = {"100%"} borderColor = 'gray' mt = {1}/> */}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>


  );
};

export default MyChats;
