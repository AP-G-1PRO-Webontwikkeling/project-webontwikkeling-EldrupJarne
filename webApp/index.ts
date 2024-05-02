import express from "express";
import ejs from "ejs";
import * as i from "../interfaces/interfaces"
import * as f from "./functions"
import * as db from "./db"
import bodyParser from "body-parser";


let app = express();
app.set("view engine", "ejs");
app.set("port", 5500);
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get("/products/:articleName", async (req, res) => {

    let product: i.Product | null = await db.productsCollection.findOne({ articleName: req.params.articleName })

    if (!product) {
        let errormessage = `"${req.params.articleName}" is not a product`
        res.render("404", {
            error: errormessage
        })
        return;
    }
    res.render("product", { product: product })
})

app.get("/products", (req, res) => {
    let shopProducts: i.Product[] = [...products]

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
                return f.compareProducts(a, b, sortParam)
            } else {
                return f.compareProducts(a, b, sortParam) * -1;
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

app.get("/editProduct/:productName", async (req, res) => {
    const productName: string = req.params.productName
    const product: i.Product | null = await db.productsCollection.findOne({ articleName: productName })
    if (!product) {
        let errormessage = `"${productName}" is not a product`
        res.render("404", {
            error: errormessage
        })
        return;
    }
    const selectedType: i.Type = product.type
    res.render("editProduct", {
        product: product,
        types: types,
        selectedType: selectedType,
        error: undefined
    })
})

app.post("/editProduct/:productName", async (req, res) => {
    const productName: string = req.params.productName
    const { name, brand, price, lastSold, type } = req.body
    let product: i.Product | null = await db.productsCollection.findOne({ articleName: productName })
    if (!product) {
        let errormessage = `"${productName}" is not a product`
        res.render("404", {
            error: errormessage
        })
        return;
    }
    const selectedType: i.Type | null = await db.typesCollection.findOne({ typeName: type })
    if (!selectedType) {
        let errormessage = `"${type}" is not a type`
        res.render("404", {
            error: errormessage
        })
        return;
    }
    const nameCheck = f.isValid(name)
    const brandCheck = f.isValid(brand)
    const priceCheck = f.isValid(parseInt(price))
    const lastSoldCheck = f.isValid(lastSold)
    const typeCheck = f.isValid(selectedType)

    if (!nameCheck.isValid) return res.render("editProduct", {
        product: product,
        types: types,
        selectedType: selectedType,
        error: nameCheck.errorCode
    })
    if (!brandCheck.isValid) return res.render("editProduct", {
        product: product,
        types: types,
        selectedType: selectedType,
        error: brandCheck.errorCode
    })
    if (!priceCheck.isValid) return res.render("editProduct", {
        product: product,
        types: types,
        selectedType: selectedType,
        error: priceCheck.errorCode
    })
    if (!lastSoldCheck.isValid) return res.render("editProduct", {
        product: product,
        types: types,
        selectedType: selectedType,
        error: lastSoldCheck.errorCode
    })
    if (!typeCheck.isValid) return res.render("editProduct", {
        product: product,
        types: types,
        selectedType: selectedType,
        error: typeCheck.errorCode
    })

    await db.productsCollection.updateOne({ index: product.index }, {
        $set: {
            articleName: name.trim(),
            brand: brand.trim(),
            price: price,
            lastSold: lastSold.trim(),
            type: selectedType
        }
    })


    products = await db.productsCollection.find({}).toArray();
    product = await db.productsCollection.findOne({ articleName: product.articleName })

    if (!product) {
        let errormessage = `"${productName}" is not a product`
        res.render("404", {
            error: errormessage
        })
        return;
    }
    res.redirect(`/products/${product.articleName}`)
})

app.get("/types/:typeName", (req, res) => {
    let type: i.Type | undefined = types.find(e => e.typeName == req.params.typeName)
    let productsOfType: i.Product[] = products.filter(e => e.type.typeName === type?.typeName)

    if (type === undefined) {
        let errormessage = `"${req.params.typeName}" is not a Type`
        res.render("404", {
            error: errormessage
        })
    } else {
        res.render("type", {
            type: type,
            products: productsOfType
        })
    }
})

app.get("/types", (req, res) => {
    let shopTypes: i.Type[] = [...types]

    let filter: string = "";
    let sortParam: string = "typeName";
    let direction: string = "";

    if (Object.keys(req.query).length !== 0) {
        filter = `${req.query.filter}`;
        sortParam = `${req.query.sortParam}`;
        direction = `${req.query.direction}`;

        // filter
        if (filter !== "") {
            shopTypes = [...shopTypes.filter(e => {

                return `${e.typeName}${e.description}${e.tags.join("")}`.toLowerCase().includes(filter.toLowerCase())
            })]
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
        shopTypes.sort((a, b) => {
            if (direction === "" || direction === "0") {
                return 0;
            } else if (direction === "1") {
                return f.compareTypes(a, b, sortParam)
            } else {
                return f.compareTypes(a, b, sortParam) * -1;
            }
        })
        // save sortParam to use next page visit
        lastSortParam = sortParam
    }

    res.render("types", {
        types: shopTypes,
        filter: filter,
        direction: direction,
        sortParam: sortParam
    })
})

app.listen(app.get("port"), async () => {
    await db.connect()
    products = await db.productsCollection.find({}).toArray();
    types = await db.typesCollection.find({}).toArray();
    console.log("[server] listening at http://localhost:" + app.get("port"));
})