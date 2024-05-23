import express from "express";
import * as db from "../db"
import * as i from "../interfaces"
import * as f from "../functions"
import { secureMiddleware } from "../middleware/secureMiddleware";
import { restrictedAccessMiddleware } from "../middleware/restrictedAccessMiddleware"
import ShowMenuMiddleware from "../middleware/showMenuMiddleWare";

export default function editProductRouter() {
    const router = express.Router();
    router.use(ShowMenuMiddleware)
    router.use(secureMiddleware)
    router.use(restrictedAccessMiddleware)
    router.get("/:productName", async (req, res) => {
        if (res.locals.user.role !== "ADMIN") {
            return res.redirect("back");
        }
        const productName: string = req.params.productName
        const product: i.Product | null = await db.productsCollection.findOne({ articleName: productName })
        if (!product) {
            let errormessage = `"${productName}" is not a product`
            return res.render("404", {
                error: errormessage
            })
            return;
        }
        const selectedType: i.Type = product.type
        return res.render("editProduct", {
            product: product,
            newName: product.articleName,
            types: await db.typesCollection.find({}).toArray(),
            selectedType: selectedType,
            error: undefined
        })
    })
    router.post("/:productName", async (req, res) => {
        const productName: string = req.params.productName
        const { name, brand, price, lastSold, type } = req.body
        let product: i.Product | null = await db.productsCollection.findOne({ articleName: productName })
        if (!product) {
            let errormessage = `"${productName}" is not a product`
            return res.render("404", {
                error: errormessage
            })
            return;
        }
        const selectedType: i.Type | null = await db.typesCollection.findOne({ typeName: type })
        if (!selectedType) {
            let errormessage = `"${type}" is not a type`
            return res.render("404", {
                error: errormessage
            })
            return;
        }
        const nameCheck = f.isValid(name)
        const brandCheck = f.isValid(brand)
        const priceCheck = f.isValid(parseInt(price))
        const lastSoldCheck = f.isValid(lastSold)
        const typeCheck = f.isValid(selectedType)

        const tempProduct: i.Product = {
            index: product.index,
            articleName: name,
            price: price,
            lastSold: lastSold,
            imageSrc: product.imageSrc,
            type: type,
            brand: brand,
            infoShort: product.infoShort,
            info: product.info,
            count: product.count,
            isOnCart: product.isOnCart,
            isOnWishlist: product.isOnWishlist,
            specifications: product.specifications,
            reviews: product.reviews
        }

        if (!nameCheck.isValid) return res.render("editProduct", {
            product: tempProduct,
            newName: name,
            types: await db.typesCollection.find({}).toArray(),
            selectedType: selectedType,
            error: nameCheck.errorCode
        })
        if (!brandCheck.isValid) return res.render("editProduct", {
            product: tempProduct,
            newName: name,
            types: await db.typesCollection.find({}).toArray(),
            selectedType: selectedType,
            error: brandCheck.errorCode
        })
        if (!priceCheck.isValid) return res.render("editProduct", {
            product: tempProduct,
            newName: name,
            types: await db.typesCollection.find({}).toArray(),
            selectedType: selectedType,
            error: priceCheck.errorCode
        })
        if (!lastSoldCheck.isValid) return res.render("editProduct", {
            product: tempProduct,
            newName: name,
            types: await db.typesCollection.find({}).toArray(),
            selectedType: selectedType,
            error: lastSoldCheck.errorCode
        })
        if (!typeCheck.isValid) return res.render("editProduct", {
            product: tempProduct,
            newName: name,
            types: await db.typesCollection.find({}).toArray(),
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
        product = await db.productsCollection.findOne({ articleName: name })

        if (!product) {
            let errormessage = `"${productName}" is not a product`
            res.render("404", {
                error: errormessage
            })
            return;
        }
        res.redirect(`/products/${product.articleName}`)
    })
    return router;
}