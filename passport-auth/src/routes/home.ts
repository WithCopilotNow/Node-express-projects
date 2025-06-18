import express, {type Request, type Response} from "express";

export const homeRoute = express.Router();

homeRoute.route("/")
.get((req: Request, res: Response) => {
    res.render("index.ejs", {messages: req.flash("error")})
})