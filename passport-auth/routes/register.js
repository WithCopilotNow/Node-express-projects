import express from "express";
import crypto from "node:crypto";
import util from "util";
import { User } from "../models/userModel.js";

export const scrypt = util.promisify(crypto.scrypt);
export const registerRoute = express.Router();

registerRoute.get("/", (req, res) => {
    res.render("register.ejs")
})

registerRoute.post("/", async (req, res) => {
    try {
        const password = req.body.password;
        const keylen = 32;
        const salt = crypto.randomBytes(16)
        const hashPassword = await scrypt(password, salt, keylen);
        await User.create({name: req.body.name, email: req.body.email, password: `${salt.toString("base64")}_${hashPassword.toString("base64")}`})
        return res.redirect("/login");
    } catch (err) {
        res.redirect("/register");
    }
})