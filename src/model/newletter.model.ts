import mongoose from "mongoose";

const newletterSchema = new mongoose.Schema({
    title: {type: String},
    content: {type: String},
    newsletterOwnerId: {type: String}
}, {timestamps: true});


const Newletter = mongoose.model<Newsletter>('Newletter', newletterSchema);


export default Newletter;