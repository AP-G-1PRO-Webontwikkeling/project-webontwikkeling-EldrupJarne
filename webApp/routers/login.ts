import express, { application } from "express";
import * as db from "../db"
import * as i from "../interfaces"
import hideMenuMiddleware from "../middleware/hideMenuMiddleWare";
import bcrypt from "bcrypt"
export default function loginRouter() {
    const router = express.Router();
    router.use(hideMenuMiddleware)
    router.get("/", (req, res) => {
        if (req.session.user) {
            res.locals.user = req.session.user;
            return res.redirect("/")
        }
        res.render("login")
    })
    router.post("/", async (req, res) => {
        const { username, password } = req.body
        try {
            let user: i.User = await db.login(username, password);
            delete user.password;
            req.session.user = user;
            res.redirect("/")
        } catch (e: any) {
            req.session.message = { type: "error", message: e.message };
            res.redirect("/login");
        }
    });
    router.post("/logout", async (req, res) => {
        req.session.destroy(() => {
            res.redirect("/login");
        });
    });
    router.get("/register", (req, res) => {
        res.render("register")
    })
    router.post("/register", async (req, res) => {
        try {
            const { username, password } = req.body
            const userExists: boolean = await db.usersCollection.findOne({ username: username }) ? true : false
            if (userExists) {
                throw new Error("username already exists")
            }
            db.usersCollection.insertOne({
                username: username,
                role: "USER",
                password: await bcrypt.hash(password, 10)
            });
            res.redirect("/login")
        } catch (e: any) {
            req.session.message = { type: "error", message: e.message }
            res.redirect("/login/register")
        }
    })
    return router;
}