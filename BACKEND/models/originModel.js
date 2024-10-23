import mongoose from "mongoose";
import { sanitizeInput } from "../helpers/inputSanitizer.js";

const { Schema } = mongoose;

const originSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    set: sanitizeInput,
  },
  description: {
    type: String,
    maxlength: 500,
    set: sanitizeInput,
  },
  allowsMagic: {
    type: Boolean,
    default: false,
  },
  statsLimits: {
    courage: {
      min: { type: Number, default: null },
      max: { type: Number, default: null },
    },
    force: {
      min: { type: Number, default: null },
      max: { type: Number, default: null },
    },
    adresse: {
      min: { type: Number, default: null },
      max: { type: Number, default: null },
    },
    intelligence: {
      min: { type: Number, default: null },
      max: { type: Number, default: null },
    },
    charisme: {
      min: { type: Number, default: null },
      max: { type: Number, default: null },
    },
  },
  maxNaturalPR: { type: Number, default: 0 },
  initialHealthPoints: { type: Number, required: true },
  equipmentRestrictions: {
    maxArmorPR: { type: Number, default: 0 },
    maxCarriedWeight: { type: Number, default: 0 },
    allowedWeapons: [{ type: Schema.Types.ObjectId, ref: "Weapon" }],
    disallowedArmor: [{ type: Schema.Types.ObjectId, ref: "Armor" }],
  },
  innateAbilities: {
    nyctalopia: { type: Boolean, default: false },
    dangerSensing: { type: Boolean, default: false },
    can_use_shield: { type: Boolean, default: null, required: false },
  },
  specialNotes: {
    type: String,
    maxlength: 500,
    set: sanitizeInput,
  },
  skillsStart: [
    {
      type: Schema.Types.ObjectId,
      ref: "Skill",
    },
  ],
});

const Origin = mongoose.model("Origin", originSchema);

export default Origin;
