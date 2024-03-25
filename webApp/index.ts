import express from "express";
import ejs from "ejs";


let app = express();
app.set("view engine", "ejs");
app.set("port", 5500);

app.get("/", (req, res) => {
    res.render("index")
})


app.listen(app.get("port"), () => {
    console.log("[server] listening at http://localhost:" + app.get("port"));
})