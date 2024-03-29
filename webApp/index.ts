import express from "express";
import ejs from "ejs";
import * as i from "../interfaces/interfaces"
import * as f from "./functions"


let app = express();
app.set("view engine", "ejs");
app.use(express.static('public'))
app.set("port", 5500);

let products: i.Product[];
let types: i.Type[];
let lastSortParam: string = "articleName";


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
app.get("/products/:articleName", (req, res) => {

    let product: i.Product | undefined = products.find(e => e.articleName == req.params.articleName)

    if (product === undefined) {
        let errormessage = `"${req.params.articleName}" is not a product`
        res.render("404", {
            error: errormessage
        })
    } else {
        res.render("product", { product: product })
    }
})
app.get("/products", (req, res) => {
    let shopProducts = [...products]

    let filter: string = "";
    let sortParam: string = "articleName";
    let direction: string = "";

    if (Object.keys(req.query).length !== 0) {
        filter = `${req.query.filter}`;
        sortParam = `${req.query.sortParam}`;
        direction = `${req.query.direction}`;
        // filter
        if (filter !== "") {
            shopProducts = [...shopProducts.filter(e => `${e.articleName}${e.brand}${e.type.typeName}`.toLowerCase().includes(filter.toLowerCase()))]
        }
        // sort 
        // see if sort param changed
        // - if no, change direction
        // - if yes, restart direction loop
        if (sortParam === lastSortParam) {
            direction = f.toggleDirection(direction)
        } else {
            direction = "1";
        }
        // execute sort
        shopProducts.sort((a, b) => {
            if (direction === "" || direction === "0") {
                return 0;
            } else if (direction === "1") {
                return f.compareValues(a, b, sortParam)
            } else {
                return f.compareValues(a, b, sortParam) * -1;
            }
        })
        // save sortParam to use next page visit
        lastSortParam = sortParam
    }

    res.render("products", {
        products: shopProducts,
        filter: filter,
        direction: direction,
        sortParam: sortParam
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