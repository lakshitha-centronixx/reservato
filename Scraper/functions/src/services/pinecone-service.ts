import { Pinecone } from '@pinecone-database/pinecone';
import { buildSearchText, flattenObject } from '../helpers/functions';
import { PineconeStore } from '@langchain/pinecone';
import { MistralAIEmbeddings } from '@langchain/mistralai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Document } from '@langchain/core/documents';

export class PineconeService {
    private readonly pinecone: Pinecone;
    private readonly textSplitter: RecursiveCharacterTextSplitter;

    constructor() {
        this.pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

        this.textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
            separators: ["\n\n", "\n", ". ", "? ", "! ", " ", ""],
        });
    }

    async upsert(restaurantInfo: any) {
        const index = this.pinecone.Index(process.env.PINECONE_INDEX!);

        const fullTextForRestaurant = buildSearchText(restaurantInfo);
        const baseMetadata = flattenObject(restaurantInfo);

        baseMetadata['core_name'] = restaurantInfo.coreInfo?.name;
        baseMetadata['restaurant_id'] = restaurantInfo.id;

        const chunks: Document[] = await this.textSplitter.createDocuments(
            [fullTextForRestaurant],
            [baseMetadata]
        );

        await PineconeStore.fromDocuments(
            chunks,
            new MistralAIEmbeddings({
                apiKey: process.env.MISTRAL_API_KEY,
                model: "mistral-embed"
            }),
            {
                pineconeIndex: index
            }
        );
    }
}