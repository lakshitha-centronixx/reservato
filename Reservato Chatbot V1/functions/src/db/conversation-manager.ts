import { ChatCompletionMessageParam } from "openai/resources.mjs";
import { getRecommendationSystemPrompt } from "../llm/prompts/recommendation-system-prompt";
import { FirebaseConfig } from "../firebase-config";

const firebase = FirebaseConfig.getInstance();
const db = firebase.getDb();

export class ConversationManager {
    private readonly sessionRef: FirebaseFirestore.DocumentReference;

    constructor(sessionId: string) {
        this.sessionRef = db.collection('conversations').doc(sessionId);
    }

    async updateConversations(updatedConversations: ChatCompletionMessageParam[]) {
        const doc = await this.sessionRef.get();

        if (doc.exists) {
            await this.sessionRef.update({
                conversation: updatedConversations
            });
        }
    }

    async getConversation(location: string): Promise<ChatCompletionMessageParam[]> {
        const doc = await this.sessionRef.get();

        let conversation: ChatCompletionMessageParam[] = [
            { role: "system", content: getRecommendationSystemPrompt() },
            { role: "user", content: `My current location ${location}` }
        ];

        if (doc.exists) {
            const data = doc.data();
            return data?.conversation ?? conversation;
        } else {
            await this.sessionRef.set({
                conversation: conversation
            });
        }

        return conversation;
    }
}
