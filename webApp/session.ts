import session from "express-session";
import { User, FlashMessage } from "./interfaces";
import mongoDbSession from "connect-mongodb-session";
const MongoDBStore = mongoDbSession(session);
const mongoStore = new MongoDBStore({
    uri: process.env.MONGO_URI || "mongodb://localhost:27017",
    collection: "sessions",
    databaseName: "login-express",
});
declare module 'express-session' {
    export interface SessionData {
        user?: User,
        message: FlashMessage
    }
}
export default session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    store: mongoStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
});