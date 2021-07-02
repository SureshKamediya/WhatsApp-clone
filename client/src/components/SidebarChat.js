import { Avatar } from "@material-ui/core";
import React from "react";
import "./SidebarChat.css";

function SidebarChat({ room, theUser }) {
  if (theUser) {
    return (
      <div className="sidebarChat">
        <Avatar src={`/uploads/${theUser.user_image}`} />
        <div className="sidebarChat_info">
          <h3>{theUser.name}</h3>
        </div>
      </div>
    );
  }
  if (room) {
    return (
      <div className="sidebarChat">
        <Avatar src={`/uploads/${room.room_image}`} />
        <div className="sidebarChat_info">
          <h3>{room.name}</h3>
          <p>This is the last message</p>
        </div>
      </div>
    );
  }
}

export default SidebarChat;
