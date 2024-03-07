import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import Signup from "./Signup";
import  "./Login.css";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const {user,setUser} =ChatState();
  const history = useHistory();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );


      toast({
        title: "Login Successful",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);

      if(data)
      { setUser(data);
        history.push("/chats");
      }

      // history.push("/chats");
     
  
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };



  return (
    <div className = "main">
    <div id="title">𝐋𝐨𝐠𝐢𝐧</div>
    <div id ="login">    
    <VStack spacing="5%">
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue" variant="solid"
        width="50%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>    </VStack>
      <footer className ="footer">
      <div>Or</div>
      <div onClick={() => {
          setEmail("guestuser2@example.com");
          setPassword("123456");
        }} style={{color:'black',cursor:'pointer'}} >Login as <span style={{
          color:'#083AA9','font-weight':'bold'}}>Guest user</span></div>
        <div className="border"></div></footer>
      
      {/* <Button */}
      {/*   variant="outline" */}
      {/*   colorScheme="white" */}
      {/*   width="50%" */}
      {/*   color="blue" */}
      {/*   onClick={() => { */}
      {/*     setEmail("guest@example.com"); */}
      {/*     setPassword("123456"); */}
      {/*   }} */}
      {/*         > */}
      {/*   Get Guest User Credentials */}
      {/* </Button> */}

      

{/*       <Button */}
{/*         variant="outline" */}
{/*         colorScheme="black" */}
{/*         width="50%" */}
{/*         color="black" */}
{/*         onClick={}> */}
{/*         Sign-Up */}
{/*       </Button> */}
{/*  */}

</div>  


    </div>
  );
};

export default Login;
