import { RecommendationResponse } from "../llm/schema/langchain-recommendation-schema";

export function formatResponseToString(llmResponse: RecommendationResponse) {
    if (llmResponse.recommendations.length > 0) {
        return `${llmResponse.text}. Recommendations: ${llmResponse.recommendations
            .map(r => `${r.restaurantName} (${r.googleId}) - ${r.description}`)
            .join(", ")}`;
    }

    return `${llmResponse.text}`;
}