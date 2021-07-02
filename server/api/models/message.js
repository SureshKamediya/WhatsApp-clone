import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
  message: {
    type: String,
    trim: true,
    required: true,
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "rooms",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  user_name: {
    type: String,
    required: true,
    default: "",
  },
  timestamp: String,
});

export default mongoose.model("Message", messageSchema);
