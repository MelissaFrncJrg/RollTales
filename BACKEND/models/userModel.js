import mongoose from "mongoose";
// import crypto from "crypto";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    pseudo: {
      type: String,
      required: [true, "First name is required"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([-.]\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [12, "Password must be at least 12 characters"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z]).{12,}$/,
        "Password must contain at least 12 characters, one uppercase, and one lowercase letter.",
      ],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    // Générer un sel qui sera ajouté au mot de passe pour le hacher
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to verify password
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
