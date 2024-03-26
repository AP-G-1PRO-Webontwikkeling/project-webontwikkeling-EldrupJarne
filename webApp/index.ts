import express from "express";
import ejs from "ejs";
import * as i from "../interfaces/interfaces"


let app = express();
app.set("view engine", "ejs");
app.set("port", 5500);

let products: i.Product;
let types: i.Type;

app.get("/", (req, res) => {
    res.render("index")
})

app.listen(app.get("port"), async () => {
    console.log("[server] listening at http://localhost:" + app.get("port"));
    let productsFetch: any = await fetch("https://github.com/EldrupJarne/JSON-Host/raw/main/products.json");
    productsFetch = await productsFetch.json();
    products = await productsFetch;
    let typesFetch: any = await fetch("https://github.com/EldrupJarne/JSON-Host/raw/main/types.json");
    typesFetch = await typesFetch.json();
    types = await typesFetch;
    console.log("[server] API fetched!");
})