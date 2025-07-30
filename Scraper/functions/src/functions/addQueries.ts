import { QueryManager } from './../managers/query-manager';
import { onRequest } from "firebase-functions/v2/https";

export const AddQueries = onRequest(async (req, res) => {

    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }

    if (req.method !== 'GET') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    const queryManager = new QueryManager();
    queryManager.put();

    res.send();
});
