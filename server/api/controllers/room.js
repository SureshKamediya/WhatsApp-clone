import roomModel from "../models/room.js";
import user from "../models/user.js";

const roomController = {
  createRoom: async (req, res) => {
    let room;
    if (req.file) {
      room = await roomModel
        .create({
          name: req.body.name,
          users: req.body.users,
          admins: req.body.admins,
          room_image: req.file.originalname,
        })
        .catch((error) => res.status(500).send(error));
    } else {
      room = await roomModel
        .create({
          name: req.body.name,
          users: req.body.users,
          admins: req.body.admins,
        })
        .catch((error) => res.status(500).send(error));
    }
    if (room) {
      console.log(room);
      res.status(200).send({
        message: "Success",
        room: room,
      });
    }
  },

  getRoomDetails: async (req, res) => {
    const room = await roomModel
      .find({ _id: req.params.roomId })
      .catch((error) => res.status(500).send(error));

    if (room) {
      console.log(room);
      res.status(200).send({
        message: "Got your room Details",
        room: room,
      });
    }
  },
};

export default roomController;

// name room_image users messages admins
