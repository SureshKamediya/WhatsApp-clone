import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import message from "./routes/message.js";
import user from "./routes/user.js";
import room from "./routes/room.js";
import Pusher from "pusher";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { isContext } from "vm";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app config
const app = express();
const port = process.env.PORT || 9000;

dotenv.config();
const pusher = new Pusher({
  appId: process.env.Pusher_appId,
  key: process.env.Pusher_key,
  secret: process.env.Pusher_secret,
  cluster: process.env.Pusher_cluster,
  useTLS: process.env.Pusher_useTLS,
});

// middlewares
app.use(express.json());
app.use(
  "../client/public/uploads/",
  express.static(path.join(__dirname, "../client/public/uploads/"))
);
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);

// DB config
connectDB();
const db = mongoose.connection;
db.once("open", () => {
  console.log("Mongo DB connected");

  const msgCollection = db.collection("messages");
  const changeStream_1 = msgCollection.watch();

  changeStream_1.on("change", (change) => {
    console.log(change);
    if (change.operationType === "insert") {
      const messageDetail = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        message: messageDetail.message,
        room_id: messageDetail.room_id,
        user_id: messageDetail.user_id,
        user_name: messageDetail.user_name,
        timestamp: messageDetail.timestamp,
      });
    } else {
      console.log("Error triggering Pusher in Messages Channel");
    }
  });

  const roomCollection = db.collection("rooms");
  const changeStream_2 = roomCollection.watch();

  changeStream_2.on("change", (change) => {
    console.log(change);
    if (change.operationType === "insert") {
      const roomDetail = change.fullDocument;
      pusher.trigger("rooms", "inserted", {
        name: roomDetail.name,
        room_image: roomDetail.room_image,
        users: roomDetail.users,
        messages: roomDetail.messages,
        admins: roomDetail.admins,
        _id: roomDetail._id,
      });
    } else {
      console.log("Error triggering Pusher in Rooms Channel");
    }
  });
});

// ???

// api routes
app.get("/", (req, res) =>
  res.status(200).send("Hello World!, Let's build WhatsApp clone")
);
app.use("/message", message);
app.use("/user", user);
app.use("/room", room);

// listener
app.listen(port, console.log(`Listening on localhost: ${port}`));
