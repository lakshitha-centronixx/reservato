import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { LangchainService } from "../services/langchain-service";

export const testLangs = onRequest(async (req, res) => {

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

    const { query } = req.body;

    if (!query) {
        res.status(400).json({ error: 'Missing query' });
        return;
    }

    try {
        let langchainService = new LangchainService();
        let result = await langchainService.getResponse(query);

        res.send({ "data": (result) });
    } catch (error) {
        logger.error("error", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
