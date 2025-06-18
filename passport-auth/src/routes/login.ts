import express, {type Request, type Response} from "express";
import "../../strategies/local-strategy.ts"
import passport from "passport";

export const loginRoute = express.Router();

loginRoute.route("/")
.get((req: Request, res: Response) => {
    if(req.isAuthenticated()) return res.redirect("/home");
    res.render("login.ejs", {messages: req.flash("error")})
})
.post(passport.authenticate("local", {failureFlash: true, successRedirect: "/home", failureRedirect: "/login"}))