import { MailListManager } from './../managers/mail-list-manager';
import { firestore } from "firebase-functions";
import { LlmService } from "../services/llm-service";
import { getSystemPrompt } from "../llm/prompts/system-prompt";
import { ChatCompletionMessageParam } from "openai/resources.mjs";
import { ReservatoManager } from "../managers/reservato-manager";
import { encode } from "../helpers/encryption";
import { PineconeService } from '../services/pinecone-service';
import { ApiService } from '../services/api-service';
import { transformResponseToApiBody } from '../helpers/functions';

export const Summarizer = firestore.onDocumentCreated("scraper/{docId}", async (event) => {

    const snapshot = event.data;

    if (!snapshot) {
        console.log("No data associated with the event");
        return;
    }

    const data = snapshot.data();
    const googleData = data?.data?.google;
    const yelpData = data?.data?.yelp;

    const llmService = new LlmService();
    const reservatoManager = new ReservatoManager(googleData?.id);
    const mailListManager = new MailListManager();

    const chat: ChatCompletionMessageParam[] = [
        { "role": "system", "content": getSystemPrompt() },
        { "role": "user", "content": `Google data ${JSON.stringify(googleData)}` },
        { "role": "user", "content": `Yelp data ${JSON.stringify(yelpData)}` }
    ]

    const llmResponse = await llmService.getResponse(chat);

    if (llmResponse) {
        const restaurantData = JSON.parse(llmResponse);
        await reservatoManager.writeToDB(restaurantData);

        const encryptedId = encode(googleData?.id);

        const pineconeService = new PineconeService();
        const apiService = new ApiService();

        const transformedData = transformResponseToApiBody(restaurantData);

        await pineconeService.upsert(restaurantData);
        await apiService.createRestaurant(transformedData);

        if (restaurantData?.contact?.email) {
            await mailListManager.add(googleData?.id, restaurantData?.contact?.email, googleData?.name, `${process.env.WEB_BASE_URL}/claim/${encryptedId}`, 'RESTAURANT');
        } else {
            await mailListManager.add(googleData?.id, "risindu@reservato.ai", googleData?.name, `${process.env.WEB_BASE_URL}/update/${encryptedId}`, 'ADMIN');
            await mailListManager.add(googleData?.id, "rozainshaiqua@gmail.com", googleData?.name, `${process.env.WEB_BASE_URL}/update/${encryptedId}`, 'ADMIN');
            await mailListManager.add(googleData?.id, "mubeen@reservato.ai", googleData?.name, `${process.env.WEB_BASE_URL}/update/${encryptedId}`, 'ADMIN');
        }
    }
});
