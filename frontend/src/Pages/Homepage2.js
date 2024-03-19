import {
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/react";
import { useEffect,useState,Fragment } from "react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import icon from '../images/icon2.svg'
import onlineChat from '../images/onlineChat.svg'
import chat from '../images/chat.svg'
import "./Homepage2.css";
import Lottie from "react-lottie";
import animationData from "../animations/homeAnimation.json";

function Homepage2() {

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    // if (user) history.push("/chats");
  }, [history]);

  const [login,setLogin] = useState(false);
  const [signUp,setSignUp] = useState(false);
  const openLogin = ()=>{
    setLogin(!login);
  }
  const openSignUp = ()=>{
    setSignUp(!signUp);
  }
  return (

  <main className="container" >

 
  <section>
   <navbar>
   <Box display="flex" alignItems="center">
    <img src={icon} style={{width:"10%"}} />
   <Text fontWeight = "bold" fontSize="2em" color="white">ChatFast</Text>
   </Box>
  <Box display="flex" p ="0 5px">


<Button onClick = {openLogin} bg= "white"fontWeight = "bold" fontSize="1.5em" color="#03424d" mr="15px">
        Login</Button>

      <Modal scrollBehavior="inside" height = "50%" size = "xl" isOpen={login} onClose={openLogin} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Login/>
          </ModalBody>
          <ModalFooter>
          <Text>Don't have an account? <span onClick ={()=>{openSignUp();openLogin();}} style={{
          color:'#083AA9','font-weight':'bold',cursor:"pointer"}}>Sign-up</span></Text>
          </ModalFooter>
        </ModalContent>
      </Modal>     


    <Button onClick={openSignUp}  _hover={{
        background: "#354E4F",
        color: "white",
      }} bg="#0275bf" fontWeight = "bold" fontSize="1.5em" color="white">
        Sign-up</Button>

      <Modal scrollBehavior="inside" height = "50%" size = "xl" isOpen={signUp} onClose={openSignUp} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Signup/>
          </ModalBody>
          <ModalFooter>
          <Text>Already have an account? <span onClick ={()=>{openLogin();openSignUp();}} style={{
          color:'#083AA9','font-weight':'bold',cursor:"pointer"}}>Login</span></Text>
          </ModalFooter>
        </ModalContent>
      </Modal>  

  </Box>

   </navbar>

  <div class="content">
  
  <div class="text">
  <Text color = "#354E4F" fontWeight = "bold" fontSize="3em">Connect, Grow and Inspire</Text>
  <Text fontWeight = "bold"> Stay connected with people and interact with them easily</Text>
  </div>
  <div style={{width:"50%",height:"50%"}}>

  <Lottie isClickToPauseDisabled={true} options={defaultOptions}/></div>   
  
  <Box display="flex" alignItems="center" gap="3">
  <Text fontWeight = "bold"  fontSize="1.8em">Join </Text>
  

  <Button onClick={openSignUp} class="button-51" role="button"><Text color = "#03424d" fontWeight = "bold" fontSize="3em">  Messenger</Text></Button>
  </Box>
  </div>




  <img src={chat} style={{position:"absolute",bottom:"5px",width:"30%",height:"35%" ,"align-self":"flex-start"}}/>

  <img src={onlineChat} style={{position:"absolute",bottom:"5px",width:"30%",height:"35%","align-self":"flex-end"}}/>

  </section>



</main>//new

  );
}

export default Homepage2;
