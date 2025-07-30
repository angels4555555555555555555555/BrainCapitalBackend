import { Schema, model } from "mongoose";

const klarnaPriceSchema = new Schema({
    currentPrice: {
        type: Number,
        required: true,
    }
},
    { timestamps: true}
);

export default model("KlarnaPrice", klarnaPriceSchema);
