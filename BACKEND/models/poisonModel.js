const poisonSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 50 },
    effect: { type: String, required: true, maxlength: 200 }, // Effet négatif ou malus
    duration: { type: Number }, // Durée de l'effet en minutes
    weight: { type: Number, default: 0 },
    ingredients: [{ type: Schema.Types.ObjectId, ref: "Ingredient" }],
    counteredBy: [{ type: Schema.Types.ObjectId, ref: "Remedy" }], // Liste des remèdes qui peuvent contrer ce poison
    price: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Poison = mongoose.model("Poison", poisonSchema);

export default Poison;
