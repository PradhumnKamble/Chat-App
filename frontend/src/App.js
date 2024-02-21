import "./App.css";
import Homepage from "./Pages/Homepage2";
import { Route,BrowserRouter as Router,Switch } from "react-router-dom";
import Chatpage from "./Pages/Chatpage";

function App() {


  return (
<Router>   
 <div className="App">
<Switch>

      <Route path="/" component={Homepage} exact />
      <Route path="/chats" exact component={Chatpage} >  
      
      </Route>

</Switch>

    </div>
</Router>

  );
}

export default App;
