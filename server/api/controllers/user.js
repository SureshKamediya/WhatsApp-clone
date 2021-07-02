import bcrypt from "bcryptjs";
import userModel from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const userController = {
  createUser: async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    let user;
    if (req.file) {
      user = await userModel
        .create({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          user_image: req.file.originalname,
        })
        .catch((error) => res.status(500).send(error));
    } else {
      user = await userModel
        .create({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        })
        .catch((error) => res.status(500).send(error));
    }
    if (user) {
      const { password, ...data } = await user.toJSON();
      console.log(data);
      res.status(201).send({
        message: "Success",
        user: data,
      });
    }
  },

  loginUser: async (req, res) => {
    const user = await userModel
      .findOne({ email: req.body.email })
      .catch((error) => res.status(500).send(error));
    if (!user) {
      return res.status(200).send({
        message: "User Not Found",
      });
    }

    if (!(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(200).send({
        message: "Invalid credentials(wrong Password)",
      });
    }

    const token = await jwt.sign({ _id: user._id }, process.env.Jwt_secret);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

    const { password, ...data } = await user.toJSON();
    res.status(200).send({
      message: "Success",
      user: data,
    });
  },

  validateUser: async (req, res) => {
    try {
      const cookie = req.cookies["jwt"];
      const claims = jwt.verify(cookie, process.env.Jwt_secret);

      if (!claims) {
        return res.status(401).send({
          message: "Unauthenticated",
        });
      }

      const user = await userModel
        .findOne({ _id: claims._id })
        .catch((error) => res.status(500).send(error));
      const { password, ...data } = await user.toJSON();

      res.send(data);
    } catch (error) {
      return res.status(401).send({
        message: "Unauthenticated",
      });
    }
  },

  logOut: async (req, res) => {
    res.clearCookie("jwt");
    res.cookie("jwt", "", { maxAge: 0 });
    res.send({
      message: "Logged out and removed(reset) the cookie",
    });
  },

  getUsers: async (req, res) => {
    const users = await userModel
      .find({})
      .catch((error) => res.status(500).send(error));
    res.status(200).send(users);
  },

  addRoom: async (req, res) => {
    const findUser = await userModel
      .find({ _id: req.params.userId })
      .catch((error) => console.log(error));
    let prevRooms = [];
    console.log(findUser);
    if (findUser) {
      const roomsList = findUser[0].rooms;
      console.log(roomsList);
      // if (roomsList) {
      //   roomsList.map((room) => {
      //     prevRooms.push(room);
      //   });
      // }
      if (roomsList) {
        prevRooms = roomsList;
      }
    }
    prevRooms.push(req.body.roomId);
    console.log(req.body);
    console.log(prevRooms);

    const user = await userModel
      .updateOne({ _id: req.params.userId }, { rooms: prevRooms })
      .catch((error) => res.status(500).send(error));

    res.status(200).send({
      message: "Success",
      user: user,
    });
  },
};

export default userController;
