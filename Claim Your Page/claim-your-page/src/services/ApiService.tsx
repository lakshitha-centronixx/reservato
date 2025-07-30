import axios, { type AxiosInstance } from "axios";

export default class ApiService {

    private readonly apiClient: AxiosInstance;

    constructor() {
        this.apiClient = axios.create();
    }

    async getData(id: string) {
        return await this.apiClient.post("https://retrieve-cf7rwns4mq-uc.a.run.app", { "id": id });
    }

    async claim(id: string) {
        return await this.apiClient.post("https://claim-cf7rwns4mq-uc.a.run.app", { "id": id });
    }

    async update(id: string, email: string) {
        return await this.apiClient.post("https://update-cf7rwns4mq-uc.a.run.app", { "id": id, "email": email });
    }
}
