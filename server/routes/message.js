import messageController from "../api/controllers/message.js";
import express from "express";

const router = express.Router();

router.post("/", messageController.postMessage);
router.get("/sync/:roomId", messageController.getRoomMessages);

export default router;
