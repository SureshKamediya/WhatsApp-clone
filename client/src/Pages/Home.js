import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import instance from "../axios_instance";
import { Link } from "react-router-dom";
import { useStateValue } from "../StateProvider";
import { actionTypes } from "../reducer";

function Home() {
  const [{ user, roomChatId }, dispatch] = useStateValue();
  useEffect(() => {
    instance
      .get("/user/validate", { withCredentials: true })
      .then((response) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: response.data,
        });
      });
  }, []);
  console.log(roomChatId);

  /////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////

  if (user && roomChatId) {
    return (
      <div className="home">
        <div className="home_body">
          <Sidebar />
          <Chat />
        </div>
      </div>
    );
  } else if (user) {
    return (
      <div className="home">
        <div className="home_body">
          <Sidebar />
        </div>
      </div>
    );
  } else {
    return (
      <div className="home_second">
        <h2>You are not Logged in.</h2>
        <Link to="/">Login</Link>
      </div>
    );
  }
}

export default Home;

// user => rooms => messages

// user name email password rooms[room_id]            _id
// room name messages[ message_id]                    _id
// message room_id user_id message timestamp if(user_id === message.user_id => received==false)
