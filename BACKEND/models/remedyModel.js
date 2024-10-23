const remedySchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 50 },
    effect: { type: String, required: true, maxlength: 200 }, // Effet de guérison ou contrepoison
    weight: { type: Number, default: 0 },
    ingredients: [{ type: Schema.Types.ObjectId, ref: "Ingredient" }],
    counteracts: [{ type: Schema.Types.ObjectId, ref: "Poison" }], // Poisons que ce remède peut neutraliser
    price: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Remedy = mongoose.model("Remedy", remedySchema);

export default Remedy;
