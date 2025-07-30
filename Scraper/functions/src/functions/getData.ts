import { ReservatoManager } from '../managers/reservato-manager';
import { onRequest } from "firebase-functions/v2/https";
import { decode } from '../helpers/encryption';

export const getData = onRequest(async (req, res) => {

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

    const { id } = req.body;

    if (!id) {
        res.status(400).json({ error: 'Missing id' });
        return;
    }

    const placeId = decode(id);
    const reservatoManager = new ReservatoManager(placeId);
    const placeDetails = await reservatoManager.getData();

    res.send({ "data": placeDetails });
});
