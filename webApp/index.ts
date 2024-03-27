import express from "express";
import ejs from "ejs";
import * as i from "../interfaces/interfaces"
import * as f from "./functions"


let app = express();
app.set("view engine", "ejs");
app.set("port", 5500);

let products: i.Product[];
let types: i.Type[];

app.get("/", (req, res) => {
    let rng: number[] = f.getRandomNumbers(0, products.length, 6);
    const items = rng.map(i => ({
        src: products[i].imageSrc,
        name: products[i].articleName,
        brand: products[i].brand,
        price: products[i].price
    }))
    res.render("index", { items: items })
})
app.get("/products", (req, res) => {
    let headers = document.getElementsByClassName("th");
    let headerIcons: string[] = ["", "", "", "", "", ""];
    for (let i = 0; i < headers.length; i++) {
        let header = headers[i];
        header.addEventListener("click", (e) => {
            e.preventDefault();
            if (headerIcons[i] == "") {
                console.log(products[0]);

                products.sort((a, b) => a["articleName"].localeCompare(b["articleName"]))
                headerIcons[i] = "bi-up"
                console.log(products[0]);
            }
        })
    }
    res.render("products", {
        products: products,
        headers: headerIcons,
    })
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