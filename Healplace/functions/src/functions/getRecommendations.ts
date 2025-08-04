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

    const { date, sessionId, prompt, medicalLens, tone, detailLevel, careApproach, spirituality } = req.body;

    if (!date || !sessionId || !prompt || !medicalLens || !tone || !detailLevel || !careApproach || spirituality === undefined) {
        res.status(400).json({ error: 'Missing date, sessionId, prompt, medicalLens, tone, detailLevel, careApproach or spirituality' });
        return;
    }

    console.log("POST body: " + JSON.stringify(req.body))

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    try {
        const systemPromptInstructions: ISystemPromptInstructions = {
            medicalLens, tone, detailLevel, careApproach, spirituality
        }

        console.log("System prompt instructions " + JSON.stringify(systemPromptInstructions));

        const langchainService = new LangchainService();
        const serviceResponse = await langchainService.getResponse(date, sessionId, prompt, systemPromptInstructions);

        if (typeof serviceResponse === 'object' && serviceResponse !== null && Symbol.asyncIterator in serviceResponse) {
            for await (const chunk of serviceResponse) {
                res.write(`data: ${JSON.stringify(chunk.content)}\n\n`);
            }

            res.end();
        } else {
            res.write(`data: ${JSON.stringify(serviceResponse)}\n\n`);
            res.end();
        }

        res.end();
    } catch (error) {
        logger.error("error", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
