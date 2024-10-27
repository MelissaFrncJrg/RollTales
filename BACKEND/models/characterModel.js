import mongoose from "mongoose";
import { sanitizeInput } from "../helpers/inputSanitizer.js";

const { Schema } = mongoose;

const characterSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  origin: { type: Schema.Types.ObjectId, ref: "Origin", required: true },
  profession: {
    type: Schema.Types.ObjectId,
    ref: "Profession",
  },
  skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
  equipment: {
    armes: [{ type: Schema.Types.ObjectId, ref: "Weapon" }],
    armures: [{ type: Schema.Types.ObjectId, ref: "Armor" }],
  },
  inventory: {
    items: [
      {
        name: { type: String, maxlength: 50 },
        quantity: { type: Number, default: 1 },
        description: { type: String, maxlength: 200 },
      },
    ],
    gold: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value) {
          // Les personnages ne peuvent pas transporter plus de 250 pièces d'or sur eux au rique de les perdre.
          return value <= 250;
        },
        message:
          "Vous ne pouvez pas transporter plus de 250 pièces d'or sur vous. Vous pouvez confier le surplus à un allié de confiance (à vos risques et périls)",
      },
    },
  },
  level: { type: Number, required: true, default: 1 },
  experience: { type: Number, default: 0 },
  currentPV: { type: Number, required: true },
  maxPV: { type: Number, required: true },
  magicPR: { type: Number, default: 0 },
  naturalPR: { type: Number, default: 0 },
  totalPR: { type: Number, default: 0 },
  address: { type: Number, required: true },
  strength: { type: Number, required: true },
  intelligence: { type: Number, required: true },
  charisma: { type: Number, required: true },
  courage: { type: Number, required: true },
  magicAbility: { type: Number, default: 0 },
  totalWeight: { type: Number, default: 0 },
  weightLimit: { type: Number, default: 0 },
  bankAccount: {
    hasAccount: { type: Boolean, default: false },
    hasCheckbook: { type: Boolean, default: false },
    goldStored: { type: Number, default: 0 },
    valuables: [
      // tels que des gemmes ou autres bien précieux à placer en sécurité
      {
        name: { type: String, maxlength: 50 },
        quantity: { type: Number, default: 1 },
        description: { type: String, maxlength: 200 },
      },
    ],
  },
  notes: [
    {
      type: String,
      validate: {
        validator: sanitizeInput,
        message:
          "Les notes contiennent des caractères non autorisés. Corrigez les et essayez d'enregistrer à nouveau.",
      },
    },
  ],
});

// Calculer le poids total porté par le personnage
characterSchema.pre("save", function (next) {
  const character = this;

  // Calcul du poids des objets dans l'inventaire
  const inventoryWeight = (character.inventory.items || []).reduce(
    (total, item) => {
      return total + (item.weight || 0) * item.quantity; // le poids de l'objet s'il est renseigné, sinon 0
    },
    0
  );

  // Calcul du poids des armes
  const weaponsWeight = (character.equipment.armes || []).reduce(
    (total, weapon) => {
      return total + (weapon.weight || 0);
    },
    0
  );

  // Calcul du poids des armures
  const armorWeight = (character.equipment.armures || []).reduce(
    (total, armorPiece) => {
      return total + (armorPiece.weight || 0);
    },
    0
  );

  // Calcul du poids des objets spéciaux
  const objectsWeight = (character.specialItems || []).reduce(
    (total, object) => {
      return total + (object.weight || 0);
    },
    0
  );

  // Somme du poids total
  character.totalWeight =
    inventoryWeight + weaponsWeight + armorWeight + objectsWeight;

  next();
});

// Logique de validation pour vérifier les statistiques en fonction de l'origine et de la profession
const getLimits = (statLimits, stat) => {
  return {
    min: statLimits[stat]?.min ?? -Infinity,
    max: statLimits[stat]?.max ?? Infinity,
  };
};

characterSchema.pre("save", async function (next) {
  try {
    const character = this;
    const origin = await mongoose.model("Origin").findById(character.origin);
    const profession = character.profession
      ? await mongoose.model("Profession").findById(character.profession)
      : null;

    const originLimits = origin?.statLimits || {};
    const professionLimits = profession?.statLimits || {};

    const validateStat = (stat, actualValue) => {
      const { min, max } = getLimits(originLimits, stat);
      const { min: profMin, max: profMax } = getLimits(professionLimits, stat);

      return (
        actualValue >= Math.max(min, profMin) &&
        actualValue <= Math.min(max, profMax)
      );
    };

    if (
      !validateStat("courage", character.courage) ||
      !validateStat("force", character.strength) ||
      !validateStat("adresse", character.address) ||
      !validateStat("intelligence", character.intelligence) ||
      !validateStat("charisme", character.charisma)
    ) {
      throw new Error(
        "Les statistiques ne respectent pas les limites définies par l'origine."
      );
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Middleware Mongoose pour nettoyer les notes avant de les enregistrer
characterSchema.pre("save", function (next) {
  this.notes = this.notes.map((note) => sanitizeInput(note));
  next();
});

const Character = mongoose.model("Character", characterSchema);

export default Character;
