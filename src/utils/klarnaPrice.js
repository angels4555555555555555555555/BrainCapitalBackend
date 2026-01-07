import KlarnaPrice from "../models/KlarnaPrice.js";

export const getKlarnaPrice = async () => {
    try {
        const klarnaPrice = await KlarnaPrice.findOne();

        if (!klarnaPrice) {
            // Klarna price not found
            throw new Error("SpaceX-Preis nicht gefunden");
        }

        return klarnaPrice.currentPrice;
    } catch (err) {
        throw err;
    }
};