import * as admin from 'firebase-admin';

export class FirebaseConfig {
    private static instance: FirebaseConfig;

    private readonly app: admin.app.App;
    private readonly firestoreInstance: admin.firestore.Firestore;

    private constructor() {
        this.app = admin.apps.length === 0 ? admin.initializeApp() : admin.app();
        this.firestoreInstance = this.app.firestore();
    }

    public static getInstance(): FirebaseConfig {
        if (!FirebaseConfig.instance) {
            FirebaseConfig.instance = new FirebaseConfig();
        }

        return FirebaseConfig.instance;
    }

    public getDb(): admin.firestore.Firestore {
        return this.firestoreInstance;
    }
}
