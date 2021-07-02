import roomController from "../api/controllers/room.js";
import express from "express";
import multer from "multer";

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "../client/public/uploads");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/addRoom", upload.single("room_image"), roomController.createRoom);
router.get("/findRoom/:roomId", roomController.getRoomDetails);

export default router;
