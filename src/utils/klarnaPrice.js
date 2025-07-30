import KlarnaPrice from "../models/KlarnaPrice.js";

export const getKlarnaPrice = async () => {
    try {
        const klarnaPrice = await KlarnaPrice.findOne();

        if (!klarnaPrice) {
            throw new Error("Klarna price not found");
        }

        return klarnaPrice.currentPrice;
    } catch (err) {
        throw err;
    }
};