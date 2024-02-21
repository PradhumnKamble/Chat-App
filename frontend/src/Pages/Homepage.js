import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Button
} from "@chakra-ui/react";
import { useEffect,useState,Fragment } from "react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import image from '../img.svg'
import chatIcon from '../chat-bubble.png'
import planeIcon from '../up.svg'
import planeIcon2 from '../network.svg'
import "./Homepage.css";
import {ChatIcon } from "@chakra-ui/icons";
import Lottie from "react-lottie";
import animationData from "../animations/homepageAnimation.json";

function Homepage() {

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    // if (user) history.push("/chats");
  }, [history]);

const [login,setlogin] = useState(true);
const signupClick = ()=>{
setlogin(!login);
}
  return (

  <main className="container" >


  <header className ="header">

  <span width="5px"><img src={chatIcon} /></span>
  <span>Messenger</span>
  </header> 
    
    <section className="section">
    


        <div className="cover">

        <span className="coverHead">

        <span style={{display:"flex",justifyContent:"center"}}>Connect<img src={planeIcon2} width="10%" /> ,Grow 
        </span>

        <span style={{display:"flex",justifyContent:"center"}}>and Inspire 
        {/* <img src={planeIcon} width="8%"/> */}
        </span>

        </span>

        <div style={{width:"100%"}}>
       <Lottie options={defaultOptions}
                    // height={50}
                    // width={100}
        />
       </div>


        </div>

        <div  className="authentication " >
        {/* <span style={{height:'100px','font-size':'50px'}}>Login</span>        */}
   
        {
              login?
              <div >
              <div ><Login/></div>
              <div className="signup">
              <div  
              onClick={signupClick}>
              Don't have an account?<span style={{color:'#083AA9','font-weight':'bold',cursor:'pointer'}}> Sign up</span>
            </div></div>
            </div>
            :
            <div >
            <div><Signup/></div>
            
            <span className="signup">
            <span  onClick={signupClick} style={{color:'black',cursor:'pointer'}} >Already have an account? <span style={{color:'#083AA9','font-weight':'bold'}}>  Login</span>  </span></span>
            </div>



    }
   
    
      
        
        </div>





      </section>


</main>//new

  );
}

export default Homepage;
