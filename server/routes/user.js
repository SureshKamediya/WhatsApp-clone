import userController from "../api/controllers/user.js";
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

router.post("/signUp", upload.single("user_image"), userController.createUser);
router.post("/login", userController.loginUser);
router.get("/validate", userController.validateUser);
router.post("/logOut", userController.logOut);
router.get("/allUsers", userController.getUsers);
router.patch("/addRoom/:userId", userController.addRoom);

export default router;
