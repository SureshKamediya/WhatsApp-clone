import { Avatar, IconButton } from "@material-ui/core";
import Search from "@material-ui/icons/Search";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import React, { useEffect, useState } from "react";
import "./Chat.css";
import instance from "../axios_instance";
import Pusher from "pusher-js";
import { useStateValue } from "../StateProvider";

function Chat() {
  const [{ user, roomChatId }, dispatch] = useStateValue();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomDetail, setRoomDetail] = useState({});
  const roomId = roomChatId;

  useEffect(() => {
    const findRoomDetails = async () => {
      await instance.get(`/room/findRoom/${roomId}`).then((response) => {
        console.log(response.data);
        setRoomDetail(response.data.room[0]);
      });
    };
    findRoomDetails();
  }, [roomId]);

  useEffect(() => {
    instance.get(`/message/sync/${roomId}`).then((response) => {
      setMessages(response.data);
    });
  }, [roomId]);

  useEffect(() => {
    const pusher = new Pusher("63232a25b00d89d9333d", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", function (newMessage) {
      if (newMessage) {
        if (newMessage.room_id === roomId) {
          setMessages([...messages, newMessage]);
        }
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages, roomId]);
  console.log(messages);

  const sendMessage = async (e) => {
    e.preventDefault();

    await instance.post("/message", {
      message: input,
      room_id: roomId,
      user_id: user._id,
      user_name: user.name,
      timestamp: new Date().toUTCString(),
    });

    setInput("");
  };
  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar src={`/uploads/${roomDetail.room_image}`} />
        <div className="chat_headerInfo">
          <h6>{roomDetail.name}</h6>
          <p>Last seen at....</p>
        </div>
        <div className="chat_headerRight">
          <IconButton>
            <Search />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="chat_body">
        {messages &&
          messages.map((message) => {
            return (
              <p
                className={`chat_bodyMessage ${
                  message.user_id === user._id && "chat_bodyReceiver"
                }`}
              >
                <span className="chat_bodyName">{message.user_name}</span>
                {message.message}
                <span className="chat_bodyTimestamp">{message.timestamp}</span>
              </p>
            );
          })}
      </div>

      <div className="chat_footer">
        <IconButton className="mx-auto">
          <InsertEmoticonIcon />
        </IconButton>
        <form>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage} type="submit">
            Send a Message
          </button>
        </form>
        <IconButton>
          <MicIcon />
        </IconButton>
      </div>
    </div>
  );
  // chat header
  // chat body
  // chat footer
}

export default Chat;
