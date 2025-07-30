import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { LangchainService } from "../services/langchain-service";
import { ISystemPromptInstructions } from "../helpers/interfaces";

export const getRecommendations = onRequest({ timeoutSeconds: 360 }, async (req, res) => {

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

    const { sessionId, prompt, medicalLens, tone, detailLevel, careApproach, spirituality } = req.body;

    if (!sessionId || !prompt || !medicalLens || !tone || !detailLevel || !careApproach || spirituality === undefined) {
        res.status(400).json({ error: 'Missing sessionId, prompt, medicalLens, tone, detailLevel, careApproach or spirituality' });
        return;
    }

    try {
        console.log("Session " + sessionId);
        console.log("Prompt " + prompt);

        const systemPromptInstructions: ISystemPromptInstructions = {
            medicalLens, tone, detailLevel, careApproach, spirituality
        }

        console.log("System prompt instructions " + JSON.stringify(systemPromptInstructions));

        const langchainService = new LangchainService();
        const result = await langchainService.getResponse(sessionId, prompt, systemPromptInstructions);

        res.send({ "data": result });
    } catch (error) {
        logger.error("error", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
