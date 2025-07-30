import { z } from "zod";

export const recommendationSchema = z.object({
    text: z.string().describe("A direct, plain text answer to the user's question, without describing the recommendations list."),
    recommendations: z.array(
        z.object({
            googleId: z.string().describe("The Google ID of a recommended restaurant"),
            restaurantName: z.string().describe("The name of the recommended restaurant"),
            description: z.string().describe("A short description of the restaurant and why it was recommended"),
        }).describe("A recommended restaurant with its Google ID, name, and a description")
    ).describe("An array of recommended restaurants with descriptions").min(3).max(5),
}).strict();

export type RecommendationResponse = z.infer<typeof recommendationSchema>;
