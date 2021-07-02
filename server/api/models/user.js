import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: "String",
    required: true,
  },
  email: {
    type: "String",
    unique: true,
    required: true,
  },
  password: {
    type: "String",
    required: true,
  },
  user_image: {
    type: "String",
    default: "",
  },
  rooms: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "rooms",
    default: [],
  },
});

export default mongoose.model("User", userSchema);
