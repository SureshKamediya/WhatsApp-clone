import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/app">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

// user => rooms => users => messages

// user name email password image rooms[room_id]
// room name image messages[message_id]  users[user_id] admins[user_id]
// message message user_id room_id timestamp received
