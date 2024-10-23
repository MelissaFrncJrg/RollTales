import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import express from "express";
import connectDB from "./config/db.js";
import router from "./router.js";

dotenv.config();
const app = express();

const PORT = process.env.APP_PORT;

// Configuration du middleware
app.use(
  cors({
    origin: "https://roll-tales.netlify.app", // l'origine du frontend
    credentials: true, // on autorise l'envoi de cookies
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Router principal
app.use("/", router);

// Middleware de gestion d'erreurs global
app.use((err, req, res, next) => {
  res.status(500).send("Something broke....!");
});

// Connexion à la BDD et lancement du serveur
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening at https://rolltales-api.onrender.com`);
    });
  })
  .catch((error) => {
    console.log("Failed to connect to the database:", error);
  });
