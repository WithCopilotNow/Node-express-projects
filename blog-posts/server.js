import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { articleRoute } from "./routes/article-route.js";
import path from "node:path";
import { Article } from "./models/articles.js";
dotenv.configDotenv();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;
app.set("view-engine", "ejs");

mongoose.connect(process.env.DATABASE_URL);
mongoose.connection.once("connected", () => {
    console.log("Connected to database.");
})

app.use(express.static(path.join(import.meta.dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use("/articles", articleRoute);

app.get("/", (req, res) => {
    return res.redirect("/articles");
})

app.get("/createArticle", (req, res) => {
    return res.render("createArticle.ejs");
})

app.post("/createArticle", async (req, res) => {
    const formData = {
        title: req.body.title,
        lastmodified: new Date(),
    }
    if(req.body.description != null && req.body.description != ""){
        formData.description = req.body.description
    }
    if(req.body.articleBody != null && req.body.articleBody != ""){
        formData.articleBody = req.body.articleBody
    }
    const article = await Article.create(formData);
    return res.redirect(`/articles/${article.serializeTitle}%20${article.id}`);
})

app.listen(PORT, (err) => {
    if(err) return console.error(`Server connection error: ${err}`);
    console.log(`Server is running at http://localhost:${PORT}`)
})
