import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { PlacesManager } from "../db/places-manager";
import { GooglePlacesManager } from "../db/google-places-manage";
import { GoogleService } from "../services/google-service";

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
        const placesManager = await PlacesManager.create();
        let placeDetails = await placesManager.getPlacesDetails(placeId);

        const googlePlacesManager = new GooglePlacesManager(placeId);

        const googlePlacesDetails = await googlePlacesManager.getPlaceDetails();

        let images: string[] = [];

        if (googlePlacesDetails) {
            images = googlePlacesDetails?.data?.media;

            if (images.length > 0) {
                const googleService = new GoogleService();
                images = await googleService.getRestaurantImages(placeId);
            }
        }

        const response = {
            ...placeDetails,
            media: images,
        };

        res.send(response);
    } catch (error) {
        logger.error("error", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
