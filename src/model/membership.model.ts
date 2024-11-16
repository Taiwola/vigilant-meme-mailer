import mongoose, { Schema } from "mongoose";

export interface IMembership extends Document {
    user: mongoose.Schema.Types.ObjectId; // reference to User model
    reference: string;
    plan?: string; // Optional field
    status: "pending" | "successful" | "failed"; // Enum field for status
  }

const membershipSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  reference: { type: String, required: true },
  plan: {type: String},
  status: {
    type: String,
    enum: ["pending", "successful", "failed"],
    default: "pending",
  },
});

const membershipModel = mongoose.model<IMembership>("Membership", membershipSchema);

export default membershipModel;
