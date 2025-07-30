import { FirebaseConfig } from "../firebase-config";
import { MailTypes } from "../helpers/types";

const firebase = FirebaseConfig.getInstance();
const db = firebase.getDb();

export class MailListManager {
    private readonly sessionRef: FirebaseFirestore.DocumentReference;

    constructor() {
        this.sessionRef = db.collection('mail-list').doc("reservato");
    }

    async add(id: string, email: string, restaurantName: string, link: string, notify: MailTypes) {
        const doc = await this.sessionRef.get();

        const newEntry = { id, email, restaurantName, link, notify, emailSent: false };

        if (doc.exists) {
            const data = doc.data();
            const currentList = Array.isArray(data?.list) ? data?.list : [];
            const updatedData = [...currentList, newEntry];
            await this.sessionRef.set({ list: updatedData });
        } else {
            await this.sessionRef.set({ list: [newEntry] });
        }
    }

    async markEmailSent(id: string) {
        const doc = await this.sessionRef.get();

        if (!doc.exists) return;

        const data = doc.data();
        const list = Array.isArray(data?.list) ? data.list : [];

        const updatedList = list.map((entry: any) =>
            entry.id === id ? { ...entry, emailSent: true } : entry
        );

        await this.sessionRef.update({ list: updatedList });
    }


    async getList() {
        const doc = await this.sessionRef.get();
        return doc.exists ? doc.data()?.list ?? [] : [];
    }
}
