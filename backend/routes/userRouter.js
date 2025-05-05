import express from "express";
import expressAsyncHandler from "express-async-handler";
import data from "../data copy/adminData.js";
import { generateToken } from "../utils.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

const userRouter = express.Router();

// Route pour initialiser la base de données avec des utilisateurs
userRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    try {
      console.log('Starting seed process...');
      console.log('Data to insert:', data.users);
      await User.deleteMany({});
      console.log('Previous users deleted');
      const createdUsers = await User.insertMany(data.users);
      console.log('Users created:', createdUsers);
      res.send({ createdUsers });
    } catch (error) {
      console.error('Seed error:', error);
      res.status(500).send({ message: 'Error during seed process', error: error.message });
    }
  })
);

// Route pour la connexion
userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(401).send({ message: "Email ou mot de passe invalide" });
      }
      
      if (user.status !== "active") {
        return res.status(401).send({ message: "Compte inactif" });
      }

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
      } else {
        res.status(401).send({ message: "Email ou mot de passe invalide" });
      }
    } catch (error) {
      console.error('Signin error:', error);
      res.status(500).send({ message: "Erreur lors de la connexion" });
    }
  })
);

// Route pour l'inscription
userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    // Vérification de l'unicité de l'email
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send({ message: "Email already exists" });
    }

    // Validation du rôle
    const validRoles = ["administrator", "analyst", "technicien"];
    if (!validRoles.includes(req.body.role)) {
      return res.status(400).send({ message: "Invalid role" });
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role: req.body.role, // Ajout du rôle
      status: "active", // Statut par défaut
      lastLogin: null, // Initialisation de lastLogin
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