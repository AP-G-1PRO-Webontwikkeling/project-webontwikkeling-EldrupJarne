import express from "express";
import * as db from "../db"
import * as i from "../interfaces"
import * as f from "../functions"
import { secureMiddleware } from "../middleware/secureMiddleware";
import ShowMenuMiddleware from "../middleware/showMenuMiddleWare";
export default function typesRouter() {
    let lastSortParam: string = "articleName";
    const router = express.Router();
    router.use(ShowMenuMiddleware)
    router.use(secureMiddleware)
    router.get("/:typeName", async (req, res) => {
        let type: i.Type | null = await db.typesCollection.findOne({ typeName: req.params.typeName })
        if (!type) {
            return res.redirect("/404")
        }
        let productsOfType: i.Product[] = await db.productsCollection.find({ "type.typeName": type.typeName }).toArray()
        if (type === undefined) {
            let errormessage = `"${req.params.typeName}" is not a Type`
            return res.render("404", {
                error: errormessage
            })
        } else {
            return res.render("type", {
                type: type,
                products: productsOfType
            })
        }
    })
    router.get("/", async (req, res) => {
        let { filter, sortParam, direction } = req.query
        const filterString = `${filter}`.toLowerCase();
        const queryFilter = filterString !== "" && filterString !== "undefined" ? {
            $or: [
                { typeName: { $regex: filterString, $options: 'i' } },
                { description: { $regex: filterString, $options: 'i' } },
                { tags: { $elemMatch: { $regex: filterString, $options: 'i' } } }
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
        let query = db.typesCollection.find(queryFilter)
        if (sortObj) {
            query = query.sort(sortObj)
        }
        let shopTypes: i.Type[] = await query.toArray();
        res.render("types", {
            types: shopTypes,
            filter: filter,
            direction: direction,
            sortParam: sortParam
        })
    })
    return router;
}