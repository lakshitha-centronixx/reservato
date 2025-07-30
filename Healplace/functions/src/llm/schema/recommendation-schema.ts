import { z } from "zod";

export const recommendationSchema = z.object({
    text: z.string().nonempty().describe("Answer the user's question"),
}).strict();

export type RecommendationResponse = z.infer<typeof recommendationSchema>;
