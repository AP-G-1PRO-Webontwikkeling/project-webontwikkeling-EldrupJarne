import express from "express";
import { Product } from "./interfaces"
import { productsCollection, connect } from "./db"
import bodyParser from "body-parser";
import editProductRouter from "./routers/editProduct";
import productsRouter from "./routers/products";
import typesRouter from "./routers/types";
import session from "./session";
import loginRouter from "./routers/login";
import { secureMiddleware } from "./middleware/secureMiddleware";
import { flashMiddleware } from "./middleware/flashMiddleware";
import ShowMenuMiddleware from "./middleware/showMenuMiddleWare";
let app = express();
app.set("view engine", "ejs");
app.set("port", 5500);
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session);
app.use(flashMiddleware);
app.use(ShowMenuMiddleware)
app.get("/", secureMiddleware, async (req, res) => {
    const randomItems: Product[] = await productsCollection.aggregate([{ $sample: { size: 6 } }]).toArray() as Product[]
    res.render("index", { items: randomItems })
})
app.use("/types", typesRouter())
app.use("/products", productsRouter())
app.use("/editProduct", editProductRouter())
app.use("/login", loginRouter())
app.all("*", (req, res) => res.render("404", { error: "Page not found" }))
app.listen(app.get("port"), async () => {
    try {
        await connect()
        console.log("[server] listening at http://localhost:" + app.get("port"));
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
})