import { Schema, model } from "mongoose";

const tagesgeldSchema = new Schema({
    bank: {
        type: String,
        required: true,
        trim: true
    },
    laufzeit: {
        type: String,
        required: true,
        trim: true
    },
    betrag: {
        type: String,
        required: true,
        trim: true
    },
    zinsatz: {
        type: String,
        required: true,
        trim: true
    }
},
    { timestamps: true }
);

export default model("Tagesgeld", tagesgeldSchema);
