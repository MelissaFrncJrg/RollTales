import mongoose from "mongoose";
import { sanitizeInput } from "../helpers/inputSanitizer.js";

const { Schema } = mongoose;

const characterSchema = new Schema(
  {
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    campaign: { type: Schema.Types.ObjectId, ref: "Campaign", required: true },
    origin: { type: Schema.Types.ObjectId, ref: "Origin", required: true },
    profession: {
      type: Schema.Types.ObjectId,
      ref: "Profession",
      required: true,
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
          weight: { type: Number, default: 0 },
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
    magicAbility: { type: Boolean, default: false },
    totalWeight: { type: Number, default: 0 },
    weightLimit: { type: Number, required: true },
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
  },
  {
    timestamps: true,
  }
);

// Calculer le poids total porté par le personnage
characterSchema.pre("save", function (next) {
  const character = this;

  // Calcul du poids des objets dans l'inventaire
  const inventoryWeight = character.inventory.items.reduce((total, item) => {
    return total + (item.weight || 0) * item.quantity; // le poids de l'objet s'il est renseigné, sinon 0
  }, 0);

  // Calcul du poids des armes
  const weaponsWeight = character.weapons.reduce((total, weapon) => {
    return total + (weapon.weight || 0);
  }, 0);

  // Calcul du poids des armures
  const armorWeight = character.armor.reduce((total, armorPiece) => {
    return total + (armorPiece.weight || 0);
  }, 0);

  // Calcul du poids des objets spéciaux
  const objectsWeight = character.specialItems.reduce((total, object) => {
    return total + (object.weight || 0);
  }, 0);

  // Somme du poids total
  character.totalWeight =
    inventoryWeight + weaponsWeight + armorWeight + objectsWeight;

  next();
});

// Logique de validation pour vérifier les statistiques en fonction de l'origine
characterSchema.pre("save", async function (next) {
  try {
    const character = this;
    const origin = await mongoose.model("Origin").findById(character.origin);

    if (origin) {
      // Validation des statistiques en fonction de l'origine
      if (
        character.courage < origin.minCourage ||
        character.courage > origin.maxCourage
      ) {
        throw new Error(
          "La valeur de courage ne respecte pas les limites de l'origine."
        );
      }
      if (
        character.intelligence < origin.minIntelligence ||
        character.intelligence > origin.maxIntelligence
      ) {
        throw new Error(
          "La valeur d'intelligence ne respecte pas les limites de l'origine."
        );
      }
      if (
        character.charisma < origin.minCharisma ||
        character.charisma > origin.maxCharisma
      ) {
        throw new Error(
          "La valeur de charisme ne respecte pas les limites de l'origine."
        );
      }
      if (
        character.address < origin.minAddress ||
        character.address > origin.maxAddress
      ) {
        throw new Error(
          "La valeur d'adresse ne respecte pas les limites de l'origine."
        );
      }
      if (
        character.force < origin.minForce ||
        character.force > origin.maxForce
      ) {
        throw new Error(
          "La valeur de force ne respecte pas les limites de l'origine."
        );
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware Mongoose pour nettoyer les notes avant de les enregistrer
characterSchema.pre("save", function (next) {
  this.notes = this.notes.map((note) => {
    return sanitizeHtml(note, {
      allowedTags: [], // Pas de balises HTML autorisées
      allowedAttributes: {}, // Pas d'attributs HTML autorisés
    });
  });

  next();
});

const Character = mongoose.model("Character", characterSchema);

export default Character;
