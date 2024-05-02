import { Db, Collection, MongoClient } from "mongodb"
import dotenv from "dotenv"
import * as i from "../interfaces/interfaces"

dotenv.config();

const Client = new MongoClient(process.env.MONGO_URI || "mongodb://localhost:27017");

const db: Db = Client.db("aplinePulse");

export const productsCollection: Collection<i.Product> = db.collection<i.Product>("products")
export const typesCollection: Collection<i.Type> = db.collection<i.Type>("types")

export async function connect() {
    try {
        await Client.connect();
        console.log("[server] Connected to database\n[server] sarted seeding process");
        await seed(true);
        process.on("SIGINT", exit);
        process.on("SIGUSR2", exit);
    } catch (error) {
        console.log(error);
    }
}
async function seed(clearAll?: boolean) {
    if (clearAll) {
        try {
            const collections = await db.listCollections().toArray();
            for (let i = 0; i < collections.length; i++) {
                const collectionName = collections[i].name;
                await db.collection(collectionName).drop();
            }
            console.log('[server] All collections dropped successfully');
        } catch (error) {
            console.error('[server] Error occurred while dropping collections:', error);
        }
    }
    const isProductsEmpty = await productsCollection.countDocuments() === 0
    if (isProductsEmpty) {
        const allProductsResponse = await fetch("https://github.com/EldrupJarne/JSON-Host/raw/main/products.json");
        const allProducts: i.Product[] = await allProductsResponse.json() as i.Product[];
        try {
            await productsCollection.insertMany(allProducts);
        } catch (error) {
            console.log("[server] error with products insert\n\n" + error);
        }
    }
    const isTypesEmpty = await typesCollection.countDocuments() === 0
    if (isTypesEmpty) {
        const allTypesResponse = await fetch("https://github.com/EldrupJarne/JSON-Host/raw/main/types.json");
        const allTypes: i.Type[] = await allTypesResponse.json() as i.Type[];
        try {
            await typesCollection.insertMany(allTypes)
        } catch (error) {
            console.log("[server] error with types insert\n\n" + error);
        }
    }
    console.log("[server] database seeded");

}
async function exit() {
    try {
        Client.close()
        console.log("[server] disconnected from database");

    } catch (error) {
        console.log(error);
    }
    process.exit(0);
}
