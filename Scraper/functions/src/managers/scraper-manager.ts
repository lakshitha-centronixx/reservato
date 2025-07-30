import { FirebaseConfig } from "../firebase-config";

const firebase = FirebaseConfig.getInstance();
const db = firebase.getDb();

export class ScraperManager {
    private readonly sessionRef: FirebaseFirestore.DocumentReference;

    constructor(documentId: string) {
        this.sessionRef = db.collection('scraper').doc(documentId);
    }

    async addData(query: string, scrapedDate: Date, google: {}, yelp: {}) {
        const newEntry = { google, yelp };

        await this.sessionRef.set({
            query,
            scrapedDate,
            data: newEntry
        });
    }

    async getScraperData() {
        const doc = await this.sessionRef.get();

        if (doc.exists) {
            const data = doc.data();
            return data?.data
        }

        return null;
    }
}
