import { logger } from "firebase-functions";
import { FirebaseConfig } from "../firebase-config";

const firebase = FirebaseConfig.getInstance();
const db = firebase.getDb();

export class ReservatoManager {
    private readonly sessionRef: FirebaseFirestore.DocumentReference;

    constructor(placeId: string) {
        this.sessionRef = db.collection('reservato').doc(placeId);
    }

    async writeToDB(data: string) {
        const doc = await this.sessionRef.get();

        const dataToWrite = {
            data: data,
            validated: false,
            claimed: false
        };

        if (!doc.exists) {
            await this.sessionRef.set(dataToWrite);
        } else {
            logger.info(`ID already scraped - ${this.sessionRef.id}`)
        }
    }

    async getData() {
        const doc = await this.sessionRef.get();

        if (doc.exists) {
            const data = doc.data();
            return data;
        }

        return null;
    }

    async claim() {
        const doc = await this.sessionRef.get();

        if (doc.exists) {
            await this.sessionRef.update({ claimed: true });
        }
    }

    async updateEmail(email: string) {
        const doc = await this.sessionRef.get();

        if (doc.exists) {
            await this.sessionRef.update({ "data.contact.email": email });
        }
    }
}
