import { FirebaseConfig } from "../firebase-config";
import { queries } from "../helpers/queries";

const firebase = FirebaseConfig.getInstance();
const db = firebase.getDb();

export class QueryManager {
    private readonly sessionRef: FirebaseFirestore.DocumentReference;

    constructor() {
        this.sessionRef = db.collection('query').doc("queries");
    }

    async getQueries() {
        const doc = await this.sessionRef.get();

        if (doc.exists) {
            const data = doc.data();
            return data?.data
        }

        return null;
    }

    async updateFetched(query: string) {
        const doc = await this.sessionRef.get();

        if (doc.exists) {
            const data = doc.data();

            if (data) {
                const updatedData = data.data.map((item: { "query": string, fetched: boolean }) =>
                    item.query === query ? { ...item, fetched: true } : item
                );

                await this.sessionRef.update({ data: updatedData });
            }
        }
    }

    async put() {
        await this.sessionRef.set({ "data": queries });
    }
}
