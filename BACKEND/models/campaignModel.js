import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  player_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  users: {
    type: [String],
    default: [],
  },
  invitation: [
    {
      token: { type: String },
      email: { type: String },
      isActive: { type: Boolean },
    },
  ],
});

const Campaign = mongoose.model("Campaign", campaignSchema);

export default Campaign;
