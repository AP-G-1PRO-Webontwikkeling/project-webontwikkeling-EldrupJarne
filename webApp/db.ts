import { Db, Collection, MongoClient } from "mongodb"
import bcrypt from "bcrypt";
import dotenv from "dotenv"
import * as i from "./interfaces"
const saltRounds: number = 10;
dotenv.config();
const Client = new MongoClient(process.env.MONGO_URI || "mongodb://localhost:27017");
const db: Db = Client.db("aplinePulse");
export const productsCollection: Collection<i.Product> = db.collection<i.Product>("products")
export const typesCollection: Collection<i.Type> = db.collection<i.Type>("types")
export const usersCollection: Collection<i.User> = db.collection<i.User>("Users")
export async function connect() {
    try {
        await Client.connect();
        console.log("[server] Connected to database\n[server] sarted seeding process");
        await seed(false);
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
    await createInitialUsers();
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
async function createInitialUsers() {
    if (await usersCollection.countDocuments() > 0) {
        console.log("[server] initial user exists");
        return;
    }
    console.log("[server] creating initial users");
    // get admin login data from .env, make a user and insert it into db
    let adminEmail: string | undefined = process.env.ADMIN_USERNAME;
    let adminPassword: string | undefined = process.env.ADMIN_PASSWORD;
    try {
        if (adminEmail === undefined || adminPassword === undefined) {
            throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be set in environment");
        }
        await usersCollection.insertOne({
            username: adminEmail,
            password: await bcrypt.hash(adminPassword, saltRounds),
            role: "ADMIN"
        });
        // get user login data from .env, make a user and insert it into db
        let userEmail: string | undefined = process.env.USER_USERNAME;
        let userPassword: string | undefined = process.env.USER_PASSWORD;
        if (userEmail === undefined || userPassword === undefined) {
            throw new Error("USER_USERNAME and USER_PASSWORD must be set in environment");
        }
        await usersCollection.insertOne({
            username: userEmail,
            password: await bcrypt.hash(userPassword, saltRounds),
            role: "USER"
        });
        console.log("[server] initial user created");
    } catch (error) {
        console.log("[server] error with creating initial users");
        await exit()
        process.exit(1)
    }
}
export async function login(username: string, password: string) {
    if (username === "" || password === "") {
        throw new Error("username and password required");
    }
    let user: i.User | null = await usersCollection.findOne({ username: username });
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("Password incorrect");
        }
    } else {
        throw new Error("User not found");
    }
}