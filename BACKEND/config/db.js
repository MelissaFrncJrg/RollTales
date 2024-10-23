import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {});
    console.log(
      `Successfully connected to database: ${mongoose.connection.db.databaseName}`
    );
  } catch (error) {
    console.log("Erreur de connexion à MongoDB :", error);
    process.exit(1);
  }
};

export default connectDB;
