import express from "express";
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import { generateToken, isAuth, isAdmin } from "../utils.js";
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

// Route pour lister tous les utilisateurs (admin seulement)
userRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const users = await User.find({}).select('-password');
      console.log('Users found:', users); // Pour le débogage
      res.send(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send({ message: "Erreur lors de la récupération des utilisateurs" });
    }
  })
);

// Route pour ajouter un utilisateur (admin seulement)
userRouter.post(
  "/add",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      res.status(400).send({ message: "Un utilisateur avec cet email existe déjà" });
      return;
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role: req.body.role,
      status: req.body.status || 'active',
      lastLogin: null
    });

    const createdUser = await user.save();
    res.send({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
      status: createdUser.status,
      lastLogin: createdUser.lastLogin
    });
  })
);

// Route pour modifier un utilisateur (admin seulement)
userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).send({ message: "Utilisateur non trouvé" });
      return;
    }

    // Vérifier si l'email modifié n'existe pas déjà pour un autre utilisateur
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        res.status(400).send({ message: "Cet email est déjà utilisé" });
        return;
      }
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.status = req.body.status || user.status;
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 8);
    }

    const updatedUser = await user.save();
    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      lastLogin: updatedUser.lastLogin
    });
  })
);

// Route pour supprimer un utilisateur (admin seulement)
userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).send({ message: "Utilisateur non trouvé" });
      return;
    }

    // Empêcher un admin de se supprimer lui-même
    if (req.user._id.toString() === req.params.id) {
      res.status(400).send({ message: "Vous ne pouvez pas supprimer votre propre compte" });
      return;
    }

    await user.deleteOne();
    res.send({ message: "Utilisateur supprimé avec succès" });
  })
);

export default userRouter;