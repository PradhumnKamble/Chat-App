import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack ,Box} from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
import { useToast ,Text} from "@chakra-ui/react";
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
  const [newPassword, setNewPassword] = useState();
  const [otp, setOtp] = useState();
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [changePassLoading, setChangePassLoading] = useState(false); // pass change button
  const [otpTab, setOtpTab] = useState(false);
  const [passwordChangeTab, setPasswordChangeTab] = useState(false);
  const [loginOpen, setLoginOpen] = useState(true);
  const {user,setUser} =ChatState();
  const history = useHistory();


  const sendOtp = async()=>{
    setOtpLoading(true);
    if (!email) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setOtpLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/getOtp",
        { email },
        config
      );


      toast({
        title: "Otp has been sent to your Email",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      
      setOtpTab(true) ;
      setOtpLoading(false);
  
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setOtpLoading(false);
    }
}

 const verifyOtp = async()=>{
    setVerifyOtpLoading(true);
    if (!otp) {
      toast({
        title: "Please enter otp",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setVerifyOtpLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/verifyOtp",
        { email ,otp},
        config
      );


      toast({
        title: "Otp verified",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      setOtp("");
      setOtpTab(false) ;
      setPasswordChangeTab(true) ;
      setVerifyOtpLoading(false);
  
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setVerifyOtpLoading(false);
      setOtpTab(false) ;
    }
}

const changePassword = async()=>{
  setChangePassLoading(true) ;
  if(!newPassword){
    toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setChangePassLoading(false);
      return;
  }

  try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/updatePassword",
        { email, newPassword },
        config
      );


      toast({
        title: "Password Changed",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setNewPassword("");
      setLoginOpen(true) ;
      // setChangePassLoading(false);
      // setOtpTab(false) ;
      // setPasswordChangeTab(false);

  
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      setChangePassLoading(false);
    }  

 }


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
    {loginOpen ?
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
      </VStack>
      <Box 
        display = "flex"
        justifyContent = "center"
        flexDirection = "column"
      >
        <Box mt = "5px" color = "#083AA9" fontWeight = "bold" cursor ="pointer"
          onClick = {()=>{setLoginOpen(!loginOpen)}}
        >Forgot Password ?</Box>
        <Box display = "flex" justifyContent = "center">
        <Button
          mt = "10px"
          colorScheme="blue" variant="solid"
          width="50%"
          onClick={submitHandler}
          isLoading={loading}
        >
          Login
        </Button>    
        </Box>
      </Box>
      <footer className ="footer">
        <div>Or</div>
        <div onClick={() => {
            setEmail("guestuser2@example.com");
            setPassword("1234567");
          }} style={{color:'black',cursor:'pointer'}} >Login as <span style={{
            color:'#083AA9','font-weight':'bold'}}>Guest user</span></div>
          <div className="border"></div>
      </footer>

    </div>  
     :<Box display = "flex" justifyContent = "center" flexDirection = "column" 
     // alignItems = "center"
     >
        <Text as ="b" fontSize = "xl">User Verification : </Text>
        <FormControl id="email" isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input
            value={email}
            type="email"
            placeholder="Enter Your Email Address"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <Box display = "flex" justifyContent = "center">
          <Button colorScheme="blue" variant="solid"  
           mt = "5px" onClick = {()=>{sendOtp()}}  isLoading={otpLoading} >Send Otp</Button>
        </Box>

      <Box mt = "5px">
      {otpTab ? 
          <span >
          <FormControl id="otp" isRequired>
            
            <FormLabel>OTP</FormLabel>
            <Box  display = "flex"  alignItems ="center"> 
              <span>
                <Input
                width = "60%"
                value={otp}
                placeholder="Enter Otp"
                onChange={(e) => setOtp(e.target.value)}
                />
              <Button colorScheme="blue" variant="solid" ml = "5px" mb = {1}
               onClick = {()=>{verifyOtp()}}  isLoading={verifyOtpLoading} >Verify Otp</Button>
              
              </span> 
                </Box>
          </FormControl>
          </span>
         :
         <>
           
         { passwordChangeTab ? 

          <Box display = "flex" justifyContent = "center" flexDirection = "column" alignItems = "center">
           <FormControl id="newPassword" isRequired>
            <FormLabel>New Password</FormLabel>
            <InputGroup size="md">
              <Input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
           <Button colorScheme="blue" variant="solid" mt = "5px"
               onClick = {()=>{changePassword()}}  isLoading={changePassLoading} >Change Password
           </Button>
         </Box>


          : <></>}
         </>
         
      }</Box>


     </Box>




   }
    


    </div>
  );
};

export default Login;
