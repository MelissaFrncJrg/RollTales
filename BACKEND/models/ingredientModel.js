const ingredientSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 50 },
    description: { type: String, maxlength: 200 },
    rarity: { type: String, maxlength: 50 }, // Fréquence ou rareté de l’ingrédient
    weight: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

export default Ingredient;
