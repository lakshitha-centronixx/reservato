export class GoogleService {
    private readonly apiKey: string;

    constructor() {
        this.apiKey = process.env.GOOGLE_API_KEY!;
    }

    async getRestaurantImages(placeId: string) {
        const url = `https://places.googleapis.com/v1/places/${placeId}?fields=photos`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "X-Goog-Api-Key": this.apiKey
                }
            });

            if (!response.ok) {
                return null;
            }

            const data = await response.json();

            if (data?.photos) {
                const photos = data.photos.map((photo: any) => {
                    return `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=800&key=${this.apiKey}`;
                });

                return photos;
            }

            return [];
        } catch (error) {
            console.error("An unexpected error occurred while fetching images:", error);
            return [];
        }
    }
}