import express from "express";
import passport from "passport";
import "../strategy/local-strategy.js"

export const loginRoute = express.Router();

loginRoute.get("/", (req, res) => {
    res.render("login.ejs")
})

loginRoute.post("/", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))