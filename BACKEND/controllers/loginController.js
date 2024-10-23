import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import userService from "../services/userService.js";

dotenv.config();

export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.HASH_SECRET,
      { expiresIn: "1d" }
    );

    // Définir le cookie contenant le token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 3600000, // 1 hour
    });

    return res.status(200).json({
      message: "Connexion réussie",
      token,
      userId: user._id,
      userEmail: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Gérer la déconnexion
export const handleLogout = (req, res) => {
  // Effacer le cookie token
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  res.status(200).json({ message: "Déconnexion réussie" });
};

export const registerUser = async (req, res) => {
  const { pseudo, email, password, password_confirm } = req.body;

  // Vérifier si tous les champs ont été remplis
  if (!pseudo || !email || !password || !password_confirm) {
    return res
      .status(400)
      .json({ message: "Tous les champs doivent être remplis !" });
  }

  //  Vérifier si les mdp correspondent
  if (password !== password_confirm) {
    return res
      .status(400)
      .json({ message: "Les mots de passe ne correspondent pas" });
  }

  try {
    //  Vérifier si l'utilisateur a déjà un compte
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Vous avez déjà un compte !" });
    }

    // Création du nouvel utilisateur
    const newUser = new User({
      pseudo,
      email,
      password,
    });
    await newUser.save();

    // Génération d'un token JWT avec une clé secréte
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.HASH_SECRET,
      { expiresIn: "1h" } // Token valide 1 heure
    );

    // Envoyer le token JWT dans un cookie protégé pour éviter les failles XSS
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 3600000, // 1 hour
    });

    return res.status(201).json({
      message: "Votre compte a bien été créé.",
      token,
      userId: newUser._id,
      userEmail: newUser.email,
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    res
      .status(500)
      .json({ message: "Une erreur est survenue" + error.message });
  }
};
