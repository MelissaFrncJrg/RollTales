import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Accès non autorisé" });
    }

    const decoded = jwt.verify(token, process.env.HASH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isAdmin) {
      return res.status(401).json({
        message: "Accès refusé : seuls les administrateurs sont autorisés",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Erreur du serveur" });
  }
};

export default isAdmin;
