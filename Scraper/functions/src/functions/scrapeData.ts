import { cleanObject } from "../helpers/functions";
import { ScraperManager } from "../managers/scraper-manager";
import { GoogleService } from "../services/google-service";
import { YelpService } from "../services/yelp-service";
import { QueryManager } from "../managers/query-manager";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions/v2";

export const ScrapeData = onSchedule({ schedule: "*/5 * * * *", timeoutSeconds: 540 }, async (_) => {

    const googleServices = new GoogleService();
    const yelpServices = new YelpService();
    const queryManager = new QueryManager();

    const queries = await queryManager.getQueries();
    const unfetchedQueries = queries.filter((data: any) => !data?.fetched).slice(0, 15);

    for (const data of unfetchedQueries) {

        const query = data?.query;

        const googleDataSet = await googleServices.getNearbyRestaurants(query);

        for (const googleData of googleDataSet) {
            const locality = googleData?.addressComponents?.city;
            const name = googleData?.name;

            const yelpData = await yelpServices.searchForRestaurant(locality, name);

            const scraperManager = new ScraperManager(googleData?.id);

            await scraperManager.addData(query, new Date(), cleanObject(googleData), cleanObject(yelpData));

            try {
                await queryManager.updateFetched(query);
            } catch (err) {
                logger.error("queryManager updateFetched failed:", err instanceof Error ? { message: err.message, stack: err.stack } : err);
            }
        }
    }
});
