import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import dotenv from "dotenv";
import crypto from "node:crypto";
import util from "node:util"
import { File } from "./models/file.js";
dotenv.config();

const scrypt = util.promisify(crypto.scrypt);

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.urlencoded({ extended: true }));
const upload = multer({ dest: "uploads" });

mongoose.connect(process.env.DATABASE_URL);
mongoose.connection.once("connected", () => {
    console.log("connected to mongodb server.")
})

app.set("view-engine", "ejs");

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.post("/upload", upload.single("file"), async (req, res) => {
    const fileData = { 
        path: req.file.path, 
        originalName: req.file.originalname, 
    }      
    if(req.body.password != null && req.body.password !== ""){
        const salt = crypto.randomBytes(16);
        const keylen = 32;
        const password = await scrypt(req.body.password, salt, keylen);
        fileData.password = `${salt.toString("base64")}_${password.toString("base64")}`
    }
    const file = await File.create(fileData);
    res.render("index.ejs", { fileUrl: `${req.headers.origin}/file/${file.id}`})
})

app.route("/file/:id").get(fileUploadRoute).post(fileUploadRoute);

async function fileUploadRoute(req, res){
    const file = await File.findOne({_id: new mongoose.Types.ObjectId(req.params.id)});
    if(!file) return res.sendStatus(404);
    if(file.password != null){
        if(req.body?.password === undefined){
            return res.render("password.ejs");
        }
        if(!(await compaireHashPassword({unhashPassword: req.body.password, hashPassword: file.password}))){
            return res.render("password.ejs", { error: "Invalid password"});
        }
    }
    file.downloardCounts++;
    await file.save();
    res.download(file.path, file.originalName);
}

app.listen(PORT, (err) => {
    if(err) return console.error(err.message);
    console.log(`Server is running at http://localhost:${PORT}`)
})

async function compaireHashPassword({unhashPassword, hashPassword}){
    const [saltBase64, passwordBase64] = hashPassword.split("_");
    const salt = Buffer.from(saltBase64, "base64");
    const keylen = 32;
    const oldHashPassword = Buffer.from(passwordBase64, "base64");
    const newHashPassword = await scrypt(unhashPassword, salt, keylen);
    const isEqual = crypto.timingSafeEqual(oldHashPassword, newHashPassword);
    return isEqual;
}