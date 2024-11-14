import mongoose from "mongoose";


const subscriberSchema = new mongoose.Schema({
    newsletterOwnerId: {type: String},
    email: {type: String}
}, {timestamps: true});

const Subscriber = mongoose.model<Subscriber>('Subcriber', subscriberSchema);

export default Subscriber;