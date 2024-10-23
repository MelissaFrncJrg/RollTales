import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  token: { type: String, required: true },
  isUsed: { type: Boolean, default: false },
  expiryDate: { type: Date, required: true },
});

const Invitation = mongoose.model("Invitation", invitationSchema);

export default Invitation;
