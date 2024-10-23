import mongoose from "mongoose";

const { Schema } = mongoose;

const weaponSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    id_metier: {
      type: Number,
      required: true,
    },
    nom: {
      type: String,
      required: true,
      maxlength: 25,
    },
    dégâts: {
      type: String,
      maxlength: 15,
    },
    bonus: {
      type: String,
      maxlength: 15,
    },
    malus: {
      type: String,
      maxlength: 15,
    },
    rupture: {
      type: String,
      maxlength: 15,
    },
    type_id: {
      type: Number,
    },
    poids: {
      type: Number,
    },
    min_AD: {
      type: Number,
    },
    min_INT: {
      type: Number,
    },
    chances_fonctionnement: {
      type: String,
      maxlength: 50,
    },
    portée_utile: {
      type: Number,
    },
    dégâts: {
      type: String,
      maxlength: 25,
    },
    cadence_tir: {
      type: Number,
    },
    épreuve_tir: {
      type: String,
      maxlength: 60,
    },
    délai_rechargement: {
      type: String,
      maxlength: 25,
    },
    combustion_par_coup: {
      type: String,
      maxlength: 25,
    },
    munitions_par_coup: {
      type: String,
      maxlength: 25,
    },
    indice_de_rareté: {
      type: String,
      maxlength: 60,
    },
    spécial: {
      type: String,
      maxlength: 60,
    },
    prix: {
      type: String,
      maxlength: 10,
    },
  },
  {
    timestamps: true,
  }
);

const Weapon = mongoose.model("Weapon", weaponSchema);

export default Weapon;
