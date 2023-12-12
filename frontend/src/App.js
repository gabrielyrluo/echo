import { Route } from "react-router-dom";
import "./App.css";
import Homepage from "./Pages/Homepage";
// import Chatpage from "./Pages/Chatpage";
import Mpage from "./Pages/Mpage";
import PGpage from "./Pages/PGpage";
import CGpage from "./Pages/CGpage";

function App() {
  return (
    <div className="App">
      <Route path="/" component={Homepage} exact />
      <Route path="/intermediate" component={Mpage} />
      {/* <Route path="/chats" component={Chatpage} /> */}
      <Route path="/privatechat" component={PGpage} />
      <Route path="/groupchat" component={CGpage} />
    </div>
  );
}

export default App;
