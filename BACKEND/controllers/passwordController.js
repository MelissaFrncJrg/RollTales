import jwt from "jsonwebtoken";
import userService from "../services/userService.js";

import { sendMail } from "../services/mailService.js";

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.HASH_SECRET, {
      expiresIn: "1h", // Token expire après 1 heure
    });

    // Insertion du token dans l'URL
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // Envoi de l'email
    await sendMail({
      to: user.email,
      subject: "Réinitialisez votre mot de passe",
      html: `<p><a href="${resetLink}">Cliquez ici pour réinitialiser votre mot de passe</a></p>`,
    });

    res.status(200).json({
      message:
        "Lien de réinitialisation envoyé avec succès. Vérifiez vos spams.",
    });
  } catch (error) {
    console.error("Erreur lors de la demande de réinitialisation:", error);
    res.status(500).json({ message: "Une erreur est survenue." });
  }
};

// fonction pour réinitialiser le mot de passe en cas d'oubli
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token) {
      return res.status(401).json({ message: "Token manquant." });
    }

    const decoded = jwt.verify(token, process.env.HASH_SECRET);
    const user = await userService.getUserById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Mise à jour du mot de passe
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error);
    res.status(500).json({ message: "Une erreur est survenue." });
  }
};

// modifier le mot de passe quand l'utilisateur est connecté
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const authToken = req.cookies.token;

    const decoded = jwt.verify(authToken, process.env.HASH_SECRET);

    const user = await userService.getUserById(decoded.userId);

    // Vérification du mot de passe actuel
    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Mise à jour du mot de passe
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mot de passe :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du mot de passe" });
  }
};
