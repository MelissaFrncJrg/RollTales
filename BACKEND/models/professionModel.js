import mongoose from "mongoose";

const { Schema } = mongoose;

const professionSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  pv_init: {
    type: Number,
    maxlength: 15,
    required: false,
  },
  pr_nat_max: {
    type: String,
    maxLength: 50,
    default: null,
    required: false,
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
});

const Profession = mongoose.model("Profession", professionSchema);

export default Profession;
