import express from "express";

export const logoutRoute = express.Router();

logoutRoute.get("/", (req, res, next) => {
    req.logout((err) => {
        if(err) return next(err)
        res.redirect("/login")
    })
})