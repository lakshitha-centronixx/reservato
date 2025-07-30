import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { PlacesManager } from "../db/places-manager";

export const getRestaurantDetails = onRequest(async (req, res) => {

    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    const { placeId } = req.body;

    if (!placeId) {
        res.status(400).json({ error: 'Missing placeId' });
        return;
    }

    try {
        let placesManager = await PlacesManager.create();
        let placeDetails = await placesManager.getPlacesDetails(placeId);

        res.send(placeDetails);
    } catch (error) {
        logger.error("error", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
