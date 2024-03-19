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
import "./Homepage.css";
import Lottie from "react-lottie";
import animationData from "../animations/homeAnimation.json";


function Homepage(){

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

<main class="container" >

  <section>
   <navbar>
    <div style = {{display: "flex",alignItems:" center"}}>
        <img src={icon} width ="15%"></img>
        <div style = {{fontFamily: "Inter,sans-serif",color:"rgb(37, 36, 36)",fontWeight:"bold",fontSize:"30px"}}>ChatFast</div>
    </div>
    <div >
        <button class="button-login" onClick = {openLogin}>
        Login</button> 
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

        <button class = "button-signUp" onClick={openSignUp}>Sign-up</button>

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

    </div>
   </navbar>

   <content>
  
    <div class ="col-1">
        <div class ="text">Connect, <br></br>Grow and Inspire</div>
        <div style={{display: "flex",gap :"20px" , marginTop: "20px"}}>

            <p class ="text-2">Join</p>
            <Button onClick={openSignUp} class="button-51" role="button">ChatFast
            </Button>
        </div>
    </div>
    <div class = "col-1">
      <div style={{width:"100%",height:"100%"}}>
        <Lottie isClickToPauseDisabled={true} options={defaultOptions}/>
      </div> 
        {/* <img src ={chat} width ="100% "height="100%"></img> */}
    </div>
  </content>
{/*   <features> */}
{/*     <div class ="feat-1" style = "border-top :2px solid gray"> */}
{/*         <div class ="col-1" style ="border-right :2px solid gray"> */}
{/*         <h1> */}
{/*             Lightning-fast File-Transfer */}
{/*         </h1> */}
{/*             <p>Our platform enables users to share files quickly and efficiently, saving valuable time.</p> */}
{/*             <p>Easily upload and share files of various formats, including documents, images, videos, and more</p> */}
{/*         </div> */}
{/*         <div class="col-2"> */}
{/*             <span width ="100%" height ="100%"> */}
{/*                 <i class="fa-solid fa-images fa-9x"></i> */}
{/*             </span> */}
{/*         </div> */}
{/*     </div> */}
{/*     <div class ="feat-2"> */}
{/*         <div class = "col-1"> */}
{/*             <i class="fa-solid fa-lock fa-9x"></i> */}
{/*         </div> */}
{/*         <div class = "col-2"> */}
{/*             <h1> */}
{/*                 End-to-End Encryption */}
{/*             </h1> */}
{/*             <div> */}
{/*                 <b>Complete privacy protection</b><br></br>Your messages, files, and calls are encrypted end-to-end, ensuring that only you & the intended recipients can access them. */}
{/*             </div> */}
{/*         </div> */}
{/*     </div>  */}
{/*     <div class ="feat-3"> */}
{/*         <div class="col-1"> */}
{/*             <h1> */}
{/*                 Group Chat */}
{/*             </h1> */}
{/*             <p><b>Collaborate effortlessly</b><br></br> */}
{/*                 Connect with multiple team members, friends, or family members in real-time group chats, fostering seamless collaboration.</p>    */}
{/*         </div> */}
{/*         <div class ="col-2"> */}
{/*             <i class="fa-solid fa-users fa-9x"></i> */}
{/*         </div> */}
{/*     </div> */}
{/*     <div class ="feat-4"> */}
{/*         <div class = "col-1" > */}
{/*             <i class="fa-solid fa-video fa-9x"></i> */}
{/*         </div> */}
{/*         <div class = "col-2" > */}
{/*             <h1> */}
{/*                 Voice & Video-Calls Support */}
{/*             </h1> */}
{/*             <p> */}
{/*                 <b>Group calls made easy</b><br></br> */}
{/*                 Connect with multiple participants simultaneously in voice or video calls, facilitating smooth communication for teams or social gatherings. */}
{/*             </p> */}
{/*         </div> */}
{/*     </div> */}
{/*   </features> */}
{/*    <div style = "background-color : rgb(191, 243, 165)"> */}
{/*       <h2>ChatFast</h2> */}
{/*       Copyright ©  2023-2024 ChatFast Company. All rights reserved.  */}
{/*    </div> */}
   </section>

</main>
  )  
}


export default Homepage;