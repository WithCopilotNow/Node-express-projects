import express from "express";
import { Article } from "../models/articles.js";
import mongoose from "mongoose";

export const articleRoute = express.Router();

articleRoute.get("/", async (req, res) => {
    const articles = await Article.find();
    return res.render("articles.ejs", { articles: articles || []})
})

articleRoute.get("/:titleId", async (req, res) => {
    const [, id] = req.params.titleId.split(" ");
    const article = await Article.findOne({_id: new mongoose.Types.ObjectId(id)});
    if(!article) return res.sendStatus(404);
    return res.render("article.ejs", { article })
})

articleRoute.get("/:titleId/edit", async (req, res) => {
    const [, id] = req.params.titleId.split(" ");
    const article = await Article.findOne({_id: new mongoose.Types.ObjectId(id)});
    if(!article) return res.sendStatus(404);
    return res.render("editArticle.ejs", { article })
})

articleRoute.post("/:titleId/edit", async (req, res) => {
    const [, id] = req.params.titleId.split(" ");
    const article = await Article.findOne({_id: new mongoose.Types.ObjectId(id)});
    if(!article) return res.sendStatus(404);
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
    await Article.replaceOne({_id: new mongoose.Types.ObjectId(id)}, formData);
    return res.redirect(`/articles/${article.serializeTitle}%20${article.id}`);
})

articleRoute.post("/:titleId/delete", async (req, res) => {
    const [, id] = req.params.titleId.split(" ");
    const article = await Article.findOne({_id: new mongoose.Types.ObjectId(id)});
    if(!article) return res.sendStatus(404);
    await Article.deleteOne({_id: new mongoose.Types.ObjectId(id)});
    return res.redirect("/articles");
})


