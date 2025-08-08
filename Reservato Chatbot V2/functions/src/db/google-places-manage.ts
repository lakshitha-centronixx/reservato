import { FirebaseConfig } from "../firebase-config";

const firebase = FirebaseConfig.getInstance();
const db = firebase.getDb();

export class GooglePlacesManager {
    private readonly sessionRef: FirebaseFirestore.DocumentReference;

    constructor(placeId: string) {
        this.sessionRef = db.collection('reservato').doc(placeId);
    }

    async getPlaceDetails() {
        const doc = await this.sessionRef.get();

        if (doc.exists) {
            const data = doc.data();
            return data;
        }

        return null;
    }
}
