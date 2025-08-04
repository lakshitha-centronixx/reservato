import axios, { AxiosInstance } from 'axios';
import { IRestaurantPayload } from '../helpers/interfaces';

export class ApiService {
    private readonly client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: process.env.BASE_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
    }

    async createRestaurant(payload: IRestaurantPayload) {
        try {
            const response = await this.client.post('/scraper-restaurants/', payload);
            console.log('Restaurant created:', response.data);
        } catch (error) {
            console.error('Failed to create restaurant:', error);
        }
    }
}