import mongoose from "mongoose";

const { Schema } = mongoose;

const potionSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String, maxlength: 300 },
    effects: { type: String, required: true },
    duration: { type: String }, // Durée de l'effet, si applicable
    weight: { type: Number, default: 0 }, // Poids de la potion
    price: { type: Number, default: 0 }, // Prix de la potion
  },
  {
    timestamps: true,
  }
);

const Potion = mongoose.model("Potion", potionSchema);

export default Potion;
