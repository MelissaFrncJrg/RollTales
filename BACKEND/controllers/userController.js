import userService from "../services/userService.js";
import jwt from "jsonwebtoken";

import { validateUpdatedData } from "../helpers/validation.js";

export const showEditForm = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }
    res.render("edit-profile", { user: user.toObject(), errors: {} });
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
};

// Mettre à jour les informations du profil
export const updateUserProfile = async (req, res) => {
  try {
    const { pseudo, email, password } = req.body;

    // Validation des données du formulaire
    const errors = validateUpdatedData({ pseudo, email, password });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors, user: { ...req.body } });
    }

    // Récupérer l'utilisateur à partir du token
    const authToken = req.cookies.token;
    const decoded = jwt.verify(authToken, process.env.HASH_SECRET);
    const user = await userService.getUserById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Mise à jour des informations de l'utilisateur
    if (pseudo) user.pseudo = pseudo;
    if (email) user.email = email;
    if (password) user.password = password; // le hashage est fait dans le modèle

    await user.save();

    res.status(200).json({ message: "Profil mis à jour avec succès", user });
  } catch (err) {
    console.error("Erreur lors de la mise à jour du profil :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupèrer le profil de l'utilisateur
export const getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      userId: user._id,
      userEmail: user.email,
      isAdmin: user.isAdmin,
      pseudo: user.pseudo,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du profil" });
  }
};

// Supprimer le compte de l'utilisateur
export const deleUserAccount = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Compte supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Server error:", error });
  }
};
