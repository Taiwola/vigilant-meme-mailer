import mongoose, { Document } from "mongoose";

// Define an interface for the Subscriber document
interface Subscriber extends Document {
    newsletterOwnerId: string;
    email: string;
    source: string;
    status: string;
}

// Define the schema
const subscriberSchema = new mongoose.Schema({
    newsletterOwnerId: { type: String, required: true },
    email: { type: String, required: true },
    source: { type: String, default: "From website" },
    status: { type: String, default: "subscribed" },
}, { timestamps: true });

// Correct the typo in the model name (changed 'Subcriber' to 'Subscriber')
const SubscriberModel = mongoose.model<Subscriber>('Subscriber', subscriberSchema);

export default SubscriberModel;
