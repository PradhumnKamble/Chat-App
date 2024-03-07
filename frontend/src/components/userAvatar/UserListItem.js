import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { ChatState } from "../../Context/ChatProvider";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";

const UserListItem = ({searcheduser, handleFunction ,belongsToSearch,myContacts}) => {
  const {user} = ChatState() ;
  
  const toast = useToast();

  const addToContacts = async () => {
      try {
          if( myContacts.find( (obj) => { 
              return obj._id === searcheduser._id }) )
          {
            throw Error("User has been already added to Contacts");
          }
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const {data}  = await axios.patch(`/api/user/${user._id}/contacts`,
            {
              searcheduserId : searcheduser._id
            }, 
              config);
          toast({
            title: "Added to Contacts",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
      } catch(e) {
        toast({
          title: "Error Occured!",
          description: e.message ? e.message : "Failed to add",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "bottom-left",
        });
      }
}
  return (
    <Box borderWidth="1px" borderRadius="lg" mb={4} 
    //     background: "#38B2AC",
    //     color: "white",      }}
        >
    <Box
      cursor="pointer"
      w="100%"
      // borderWidth="2px"
      // borderRadius="lg"
      borderBottom="1px"
      borderColor="whitesmoke"
      d="flex"
      alignItems="center"
      color="black"
      px={3}
      py={3}
      
      overflowY ="scroll"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={searcheduser.name}
        src={searcheduser.pic}
      />
      <Box>
        <Text>{searcheduser.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {searcheduser.email}
        </Text>
      </Box> 
      <div> </div>
      <span >
        <Button colorScheme = 'telegram' onClick = {handleFunction}> Chat</Button>
        {
          belongsToSearch ?
          ( 
            <Button ml ={4} colorScheme ='red' onClick = {addToContacts}>Add To Contacts</Button>)
            :
          <></>
        }
        
      </span>

      </Box>

    </Box>
  );
};

export default UserListItem;
