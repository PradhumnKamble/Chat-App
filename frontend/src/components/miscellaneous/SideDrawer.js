import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import {
 FiBell
} from 'react-icons/fi';
import {IconButton}from '@chakra-ui/react';
import GroupChatModal from "./GroupChatModal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon,ChatIcon ,AddIcon} from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useHistory,Link ,Route} from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModal";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";
import MyChats from "../MyChats";
import {useEffect} from 'react'

import icon from '../../images/icon2.svg'
 
function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [myContacts,setMyContacts] = useState([]);
 
  // useEffect(() => {
  //   getContacts();
  //   // eslint-disable-next-line
  // }, [myContacts]);



  const {
    setSelectedChat,
    user,setUser,
    notification,
    setNotification,
    chats,
    setChats,
    token,setToken
  } = ChatState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
   const { 
      isOpen: isContactPanelOpen, 
      onOpen: onOpenContactPanel, 
      onClose: onCloseContactPanel
    } = useDisclosure()

  const history = useHistory();

  const logoutHandler = async() => {
    const { data } = await axios.patch(`/api/user/logout/${user._id}`);
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const getContacts = async ()=>{
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const {data} = await axios.get(`/api/user/${user._id}/contacts` ,config) ;
        setMyContacts(data.contacts) ;
        console.log(myContacts)
        
      } catch(error) {
        toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });        
      }
  }


  const accessChat = async (userId) => {
    

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
      onCloseContactPanel();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="#FDFDFD"
        w="100%"
        // p="5px 10px 5px 10px"
        style={{'border-bottom':"1px solid whitesmoke"}}
      >
        <Box w="20%" display="flex" alignItems="center"><img src={icon} style={{width:"35%"}} />
        <Text fontSize="1.8rem" fontWeight="bold">ChatFast
        </Text></Box>

        <div>
        <Tooltip label="Create an new Group" hasArrow placement="bottom-end">
            <Button  style={{'background-color':"white"}} > 
            <span class="fa-solid fa-user-group fa-lg"></span>
            <GroupChatModal>
              <Text ml ={1}>Group-Chat</Text>            
              </GroupChatModal>
            </Button>
        </Tooltip>

        <Tooltip label="See Contacts" hasArrow placement="bottom-end">
          <Button
            // display="flex"
            // alignItems="center" 
            style={{'background-color':"white"}}  
            onClick={()=>{
            onOpenContactPanel();
            getContacts() ;
          }} >
            <span ><i class="fa fa-address-book fa-lg" aria-hidden="true"></i></span>
            <Text ml ={1}>My Contacts</Text>
          </Button>
        </Tooltip>


        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button style={{'background-color':"white"}}  onClick={onOpen}>
            <span><i className="fas fa-search"></i></span>
            <Text ml ={1}>Search Users</Text>
          </Button>
        </Tooltip>
        
          <Menu >
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              {/* <BellIcon fontSize="2xl" m={1} /> */}

              <IconButton
          size="md"
          variant="ghost"
          // colorScheme="#F7FAFC"
          // bg="white"
          aria-label="open menu"
          icon={<FiBell />}
        />
            </MenuButton>
            <MenuList pl={2}  >
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem 
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton style={{backgroundColor:"white"}} as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                name={"hello"}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
{/*  */}
      {/*Search user */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>

          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {
              loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((searcheduser) => (
                <Box>
                  <UserListItem
                    key={searcheduser._id}
                    searcheduser={searcheduser}
                    handleFunction={() => accessChat(searcheduser._id)}
                    belongsToSearch = {true}
                    myContacts = {myContacts}
                  />
                  
                </Box>
              ))
            )
          }
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/*Get Contacts */}
      <Drawer placement="left" onClose={onCloseContactPanel} isOpen={isContactPanelOpen}>
        <DrawerOverlay />
        <DrawerContent>

          <DrawerHeader borderBottomWidth="1px">Contacts</DrawerHeader>
          <DrawerBody>
            {
              loading ? (
              <ChatLoading />
            ) : (
              myContacts?.map((con) => (
                  <UserListItem
                    key={con._id}
                    searcheduser={con}
                    handleFunction={() => accessChat(con._id)}
                    belongsToSearch = {false}
                  />
              ))
            )
          }
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>


    </>
  );
}

export default SideDrawer;
