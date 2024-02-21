import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { ChatState } from "../../Context/ChatProvider";
import { Button } from "@chakra-ui/button";
import axios from "axios";

const UserListItem = ({searcheduser, handleFunction }) => {
  const { user,setUser } = ChatState();
const addToContacts = async () => {

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data}  = await axios.put("/api/user/addToContacts",searcheduser, config);
      console.log(data);
      setUser(data);

}
  return (
    <Box borderWidth="1px" borderRadius="lg" py={2} 
    //     background: "#38B2AC",
    //     color: "white",      }}
        >
    <Box
      onClick={handleFunction}
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
      py={2}
      mb={2}
      
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
      </Box>  </Box>

    </Box>
  );
};

export default UserListItem;
