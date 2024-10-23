import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Accès non autorisé" });
    }

    const decoded = jwt.verify(token, process.env.HASH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Aucun utilisateur trouvé" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expiré" });
    }
    return res.status(401).json({ message: "Token invalide" });
  }
};

export default verifyToken;
