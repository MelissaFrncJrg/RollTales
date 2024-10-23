import mongoose from "mongoose";
import { sanitizeInput } from "../helpers/inputSanitizer.js";

const { Schema } = mongoose;

const armorSchema = new Schema(
  {
    nom: {
      type: String,
      required: true,
      maxlength: 50,
      set: sanitizeInput,
    },
    description: {
      type: String,
      maxlength: 200,
      set: sanitizeInput,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    PR: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    type: {
      type: String,
      required: true,
      maxlength: 25,
      set: sanitizeInput,
    },
    weight: {
      type: Number,
      min: 0,
    },
    bonus: {
      type: String,
      maxlength: 50,
    },
    malus: {
      type: String,
      maxlength: 50,
    },
    rupture: {
      type: Number,
      min: 0,
    },
    lvl_min: {
      type: Number,
      min: 1,
    },
    resistance: {
      type: String,
      maxlength: 100,
      set: sanitizeInput,
    },
    benediction: {
      type: String,
      maxlength: 250,
      set: sanitizeInput,
    },
    origin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Origin",
    },
    profession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profession",
    },
    magic: {
      type: Boolean,
      default: false,
    },
    magic_effect: {
      type: String,
      maxlength: 200,
      set: sanitizeInput,
    },
  },
  {
    timestamps: true,
  }
);

const Armor = mongoose.model("Armor", armorSchema);

export default Armor;
