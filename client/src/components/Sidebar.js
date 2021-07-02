import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import "./Sidebar.css";
import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import SidebarChat from "./SidebarChat";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useStateValue } from "../StateProvider";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";
import instance from "../axios_instance";
import Pusher from "pusher-js";
import { actionTypes } from "../reducer";

function Sidebar() {
  const [{ user, roomChatId }, dispatch] = useStateValue();
  const [rooms, setRooms] = useState([]);
  const [roomSidebar, setRoomSidebar] = useState(false);
  const [profileSidebar, setProfileSidebar] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [createRoomSidebar, setCreateRoomSidebar] = useState(false);
  const [reload, setReload] = useState(false);
  const [fileName, setFileName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomAdmins, setRoomAdmins] = useState([]);

  useEffect(() => {
    async function fetchAllUsers() {
      await instance.get("/user/allUsers").then((response) => {
        setAllUsers(response.data);
      });
    }
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (user.rooms) {
      user.rooms.map(async (roomId) => {
        await instance.get(`/room/findRoom/${roomId}`).then((response) => {
          console.log(response.data);
          setRooms((rooms) => [...rooms, response.data.room]);
        });
      });
    }
  }, [user.rooms]);

  // useEffect(() => {
  //   const pusher = new Pusher("63232a25b00d89d9333d", {
  //     cluster: "ap2",
  //   });

  //   const channel = pusher.subscribe("rooms");
  //   channel.bind("inserted", function (newroom) {
  //     if (newroom) {
  //       console.log(newroom);
  //       newroom.users.map((userId) => {
  //        if(userId === user._id){
  //          setRooms([...rooms, newroom]);
  //          handleRoom(newroom);
  //        }
  //       });
  //     }
  //   });

  //   return () => {
  //     channel.unbind_all();
  //     channel.unsubscribe();
  //   };
  // }, [user, rooms]);
  // console.log(rooms);

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const showRoomSidebar = () => {
    setAnchorEl(null);
    setRoomSidebar(!roomSidebar);
  };
  const showProfileSidebar = () => {
    setAnchorEl(null);
    setProfileSidebar(!profileSidebar);
  };
  const logOut = () => {
    setAnchorEl(null);
    instance
      .post("/user/logOut", { withCredentials: true })
      .then((response) => {
        alert(response.data.message);
      });
  };

  //removed from all Users and added in Selected Users
  const addSelectedUser = (theUser, index) => {
    let arr = allUsers;
    arr.splice(index, 1);
    setAllUsers(arr);
    setSelectedUsers((selectedUsers) => [...selectedUsers, theUser]);
    setReload(!reload);
  };

  // removed from selected Users and again back added to all Users so user is pushed at last now.
  const deleteSelectedUser = (sUser, index) => {
    let arr = selectedUsers;
    arr.splice(index, 1);
    setSelectedUsers(arr);
    setAllUsers((allUsers) => [...allUsers, sUser]);
    setReload(!reload);
  };

  // if adding group thing is stopped in middle then all selected Users will set back to null
  // and allUsers list is also fetched again as we deleted some users from our all Users State here
  const onArrowBackIcon = async () => {
    setRoomSidebar(!roomSidebar);
    setSelectedUsers([]);
    await instance.get("/user/allUsers").then((response) => {
      setAllUsers(response.data);
    });
  };

  const onArrowForwardIcon = () => {
    setCreateRoomSidebar(!createRoomSidebar);
    console.log(selectedUsers);
    console.log(user);
  };

  const handleRoom = (room) => {
    dispatch({
      type: actionTypes.SET_ROOMCHATID,
      roomChatId: room._id,
    });
    setReload(!reload);
  };
  console.log(roomChatId);

  const onDoneIcon = async (e) => {
    e.preventDefault();
    let arr2 = selectedUsers;
    arr2.push(user);
    setSelectedUsers(arr2);
    let arr3 = roomAdmins;
    arr3.push(user);
    setRoomAdmins(arr3);

    //setSelectedUsers((selectedUsers) => [...selectedUsers, user]); // add the user in selected users of the group
    //setRoomAdmins((roomAdmins) => [...roomAdmins, user]); // add the user in the admin list of of group

    // console.log(selectedUsersId);
    // console.log(roomAdminsId);

    // creating group by pushing all seleted Users Id's and adminId in the room
    const formData = new FormData();
    formData.append("name", roomName);
    selectedUsers.map((user) => {
      formData.append(`users[]`, user._id);
    });
    roomAdmins.map((admin) => {
      formData.append(`admins[]`, admin._id);
    });
    formData.append("room_image", fileName);

    const room = {
      roomId: "",
    };
    await instance.post("/room/addRoom", formData).then((response) => {
      console.log(response.data);
      if (response.data.message === "Success") {
        room.roomId = response.data.room._id;
        alert(`You room ${roomName} is created successfully`);
      }
    });

    console.log(room.roomId);
    console.log(selectedUsers);
    //Now we have to add this room in the roomList of all selectedUsers
    selectedUsers.map(async (user) => {
      await instance
        .patch(`/user/addRoom/${user._id}`, room)
        .then((response) => {
          console.log(response.data);
          if (response.data.message === "Success") {
            console.log(
              "Room Id has been added to the list of all Selected Users"
            );
            console.log(response.data.user);
          }
        });
    });

    //Now when all necessaties has done we have to set fewSidebars Render to false
    setCreateRoomSidebar(!createRoomSidebar);
    setRoomSidebar(!roomSidebar);
    setReload(!reload);
  };

  // reload feature to make site responsive whenever a user selected or deleted.
  if (reload) {
    <Redirect to={"/app"}></Redirect>;
    setReload(!reload);
  }

  if (user && profileSidebar) {
    return (
      <div className="profileSidebar">
        <div className="profileSidebar_header">
          <IconButton onClick={() => setProfileSidebar(!profileSidebar)}>
            <ArrowBackIcon />
          </IconButton>
          <h3>Profile</h3>
        </div>
        <form>
          <div className="form-group profileSidebar_avatar">
            <Avatar src={`/uploads/${user.user_image}`} />
          </div>
          <div className="form -group profileSidebar_info">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              className="form-control"
              placeholder={`${user.name}`}
            />
            <label>About </label>
            <input
              type="text"
              className="form-control"
              placeholder={`${user.about}`}
            />
            <p>{user.email}</p>
          </div>
        </form>
      </div>
    );
  }

  if (user && createRoomSidebar) {
    return (
      <div className="createRoomSidebar">
        <div className="roomSidebar_header">
          <IconButton onClick={() => setCreateRoomSidebar(!createRoomSidebar)}>
            <ArrowBackIcon />
          </IconButton>
          <h3>New Group</h3>
        </div>
        <form onSubmit={onDoneIcon} encType="multipart/form-data">
          <div className="createRoomSidebar_forDiv">
            <div className="createRoomSidebar_imageUpload">
              <Avatar />
              <input
                type="file"
                className="file"
                filename="room_image"
                accept="image/*"
                onChange={(e) => setFileName(e.target.files[0])}
              />
            </div>
          </div>
          <div className="createRoomSidebar_Name">
            <input
              type="text"
              className="createRoomSidebar_NameInput"
              placeholder="Group Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>
          <div className="createRoomSidebar_Done">
            {roomName !== "" ? (
              <IconButton type="submit">
                <DoneIcon />
              </IconButton>
            ) : (
              <div></div>
            )}
          </div>
        </form>
      </div>
    );
  }

  if (user && roomSidebar) {
    return (
      <div className="roomSidebar">
        <div className="roomSidebar_header">
          <IconButton onClick={onArrowBackIcon}>
            <ArrowBackIcon />
          </IconButton>
          <h3>Add group Participants</h3>
        </div>
        <div className="roomSidebar_search">
          <div className="roomSidebar_searchSelected">
            {selectedUsers &&
              selectedUsers.map((sUser, index) => {
                return (
                  <div key={index} className="roomSidebar_searchSelectedIcon">
                    <Avatar src={`/uploads/${sUser.user_image}`} />
                    <p>{sUser.name}</p>
                    <IconButton
                      onClick={() => deleteSelectedUser(sUser, index)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                );
              })}
          </div>
          <div className="roomSidebar_searchContainer">
            <input type="text" placeholder="Type Contact Name" />
          </div>
        </div>
        <div className="roomSidebar_users">
          {allUsers &&
            allUsers.map((theUser, index) => {
              return theUser._id !== user._id ? (
                <div
                  key={index}
                  role="button"
                  onClick={() => addSelectedUser(theUser, index)}
                >
                  <SidebarChat theUser={theUser} />
                </div>
              ) : (
                <div></div>
              );
            })}
        </div>
        <div className="roomSidebar_footer">
          {selectedUsers.length ? (
            <IconButton onClick={onArrowForwardIcon}>
              <ArrowForwardIcon />
            </IconButton>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="sidebar">
        <div className="sidebar_header">
          <Avatar src={`/uploads/${user.user_image}`} />
          <div className="sidebar_headerRight">
            <IconButton>
              <DonutLargeIcon />
            </IconButton>
            <IconButton>
              <ChatIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
              />
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={showRoomSidebar}>New Group</MenuItem>
                <MenuItem onClick={showProfileSidebar}>Profile</MenuItem>
                <Link to="/">
                  <MenuItem onClick={logOut}>Logout</MenuItem>
                </Link>
              </Menu>
            </IconButton>
          </div>
        </div>

        <div className="sidebar_search">
          <div className="sidebar_searchContainer">
            <SearchIcon />
            <input type="text" placeholder="Search for a chat" />
          </div>
        </div>

        <div className="sidebar_chat">
          {rooms &&
            rooms.map((room, index) => {
              return (
                <div
                  key={index}
                  className="sidebar_chatButton"
                  onClick={() => handleRoom(room[0])}
                >
                  <SidebarChat room={room[0]} />
                </div>
              );
            })}
          {!rooms && (
            <div>
              <h2>No rooms yet</h2>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Sidebar;
