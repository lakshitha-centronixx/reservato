import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { LangchainService } from "../services/langchain-service";

export const getRecommendations = onRequest(({ timeoutSeconds: 480 }), async (req, res) => {

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

    const { date, sessionId, prompt, location } = req.body;

    if (!date || !sessionId || !prompt || !location) {
        res.status(400).json({ error: 'Missing date, sessionId, prompt, or location' });
        return;
    }

    console.log("POST body: " + JSON.stringify(req.body))

    // res.setHeader("Content-Type", "text/event-stream");
    // res.setHeader("Cache-Control", "no-cache");
    // res.setHeader("Connection", "keep-alive");

    try {
        let langchainService = new LangchainService();
        let result = await langchainService.getResponse(date, sessionId, prompt);

        res.send(result);
    } catch (error) {
        logger.error("error", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
