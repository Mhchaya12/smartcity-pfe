import express from "express";
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import { generateToken } from "../utils.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

const userRouter = express.Router();

// Route pour initialiser la base de données avec des utilisateurs
userRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    await User.deleteMany();
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
  })
);

// Route pour la connexion
userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        user.lastLogin = new Date();
        await user.save();
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          lastLogin: user.lastLogin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

// Route pour l'inscription
userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role: req.body.role,
      status: 'active',
      lastLogin: null
    });
    const createdUser = await user.save();
    res.send({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
      status: createdUser.status,
      lastLogin: createdUser.lastLogin,
      token: generateToken(createdUser),
    });
  })
);

export default userRouter;