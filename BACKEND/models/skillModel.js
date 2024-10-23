import mongoose from "mongoose";

const { Schema } = mongoose;

const skillSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  nom: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: false,
    maxLength: 250,
  },
  bonus: {
    type: String,
    maxlength: 100,
  },
  malus: {
    type: String,
    maxlength: 100,
  },
});

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
