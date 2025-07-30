import { FirebaseConfig } from "../firebase-config";
import { IPlace } from "../models/google-places/places";
import { IYelpDetails } from "../models/yelp/yelp-details";

const firebase = FirebaseConfig.getInstance();
const db = firebase.getDb();

export class PlacesManager {
    private readonly sessionRef: FirebaseFirestore.DocumentReference;

    constructor(placeId: string) {
        this.sessionRef = db.collection('places').doc(placeId);
    }

    async writeToDB(googleDetails: Partial<IPlace>, yelpDetails: Partial<IYelpDetails> | null) {
        const doc = await this.sessionRef.get();

        const dataToWrite = {
            google: googleDetails,
            ...(yelpDetails && { yelp: yelpDetails })
        };

        if (!doc.exists) {
            await this.sessionRef.set(dataToWrite);
        } else {
            await this.sessionRef.update(dataToWrite);
        }
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
