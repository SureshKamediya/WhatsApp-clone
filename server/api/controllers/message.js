import messageModel from "../models/message.js";

const messageController = {
  postMessage: async (req, res) => {
    console.log(req.body);
    const message = await messageModel
      .create(req.body)
      .catch((error) => res.status(500).send(error));
    console.log(message);
    res.status(201).send(message);
  },

  getRoomMessages: async (req, res) => {
    const messages = await messageModel
      .find({ room_id: req.params.roomId })
      .catch((error) => res.status(500).send(error));
    res.status(200).send(messages);
  },
};
export default messageController;
