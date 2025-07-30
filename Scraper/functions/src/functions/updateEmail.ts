import { ReservatoManager } from '../managers/reservato-manager';
import { onRequest } from "firebase-functions/v2/https";
import { decode, encode } from '../helpers/encryption';
import { EmailService } from '../services/email-service';

export const UpdateEmail = onRequest(async (req, res) => {

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

    const { id, email } = req.body;

    if (!id) {
        res.status(400).json({ error: 'Missing id or Email' });
        return;
    }

    const placeId = decode(id);
    const reservatoManager = new ReservatoManager(placeId);
    const emailService = new EmailService();

    await reservatoManager.updateEmail(email);

    const document = await reservatoManager.getData();

    if (document) {
        const restaurantData = document?.data;
        const encryptedId = encode(restaurantData?.identification?.googlePlaceId);
        await emailService.sendInvitationMail(email, restaurantData?.coreInfo?.name, `https://claim.reservato.ai/claim/${encryptedId}`)
    }

    res.send("Ok");
});
