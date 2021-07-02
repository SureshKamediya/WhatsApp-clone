import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: {
    type: "String",
    required: true,
  },
  room_image: {
    type: "String",
    default: "",
  },
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "users",
    default: [],
  },
  messages: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "messages",
    default: [],
  },
  admins: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "users",
    defaults: [],
  },
});

export default mongoose.model("Room", roomSchema);
