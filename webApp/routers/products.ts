import express from "express";
import * as db from "../db"
import * as i from "../interfaces"
import * as f from "../functions"
import { secureMiddleware } from "../middleware/secureMiddleware";
import ShowMenuMiddleware from "../middleware/showMenuMiddleWare";
export default function productsRouter() {
    let lastSortParam: string = "articleName";

    const router = express.Router()
    router.use(ShowMenuMiddleware)
    router.use(secureMiddleware)
    router.get("/:articleName", async (req, res) => {

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
    router.get("/", async (req, res) => {
        let { filter, sortParam, direction } = req.query
        const filterString = `${filter}`.toLowerCase();

        const queryFilter = filterString !== "" && filterString !== "undefined" ? {
            $or: [
                { articleName: { $regex: filterString, $options: 'i' } },
                { brand: { $regex: filterString, $options: 'i' } },
                { "type.typeName": { $regex: filterString, $options: 'i' } }
            ]
        } : {}
        let sortObj: any = {};
        if (sortParam === lastSortParam) {
            direction = f.toggleDirection(`${direction}`)
        } else {
            direction = "1";
        }
        if (direction === "0") {
            sortObj = null;
        } else if (direction === "1") {
            sortObj[`${sortParam}`] = 1
        } else {
            sortObj[`${sortParam}`] = -1
        }

        let query = db.productsCollection.find(queryFilter)

        if (sortObj) {
            query = query.sort(sortObj)
        }
        let shopProducts: i.Product[] = await query.toArray();

        res.render("products", {
            products: shopProducts,
            filter: filter,
            direction: direction,
            sortParam: sortParam
        })
    })
    return router;
}