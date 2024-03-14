import { Box, Text } from "@chakra-ui/layout";
import { useEffect , useState} from "react";
import axios from "axios";


const Status = ({loggedUser, users})=>{
	let ini = String(users[0]._id === loggedUser._id ?users[1].status : users[0].status)
	
	const [status , setStatus] = useState(ini) ;

	let id = String(users[0]._id === loggedUser._id ?users[1]._id : users[0]._id ) ;

	useEffect(()=>{
		const fetchData = async () => {
		    try {
		      const { data } = await axios.get(`api/user/status/${id}`);
		      setStatus(String(data.status));
		    } catch (error) {
		      console.error('Error fetching status:', error);
		    }
	  };

	  fetchData(); 
	  const intervalId = setInterval(fetchData, 120000);

	  return () => clearInterval(intervalId);
	},[id])
	return (
		<span style = {{color : "green"  , fontSize : "20px" , marginLeft : "10px"}}>
				{status === "true" ? "(Online)" : "(Offline)"}
		</span>



	)
}

export default Status ;