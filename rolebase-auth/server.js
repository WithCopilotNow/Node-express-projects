import express from "express";
import dotenv from "dotenv";
import { projectRoute } from "./routes/project-route.js";
import { ROLE, users } from "./database/db.js";
dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(setUser);
app.use("/projects", projectRoute);

app.get("/dashboard", (req, res) => {
    return res.send("dashboard page")
})

app.get("/", (req, res) => {
    return res.send("home page")
})

app.get("/admin", checkRole(ROLE.ADMIN), (req, res) => {
    return res.send("Admin page");
})

app.get("/users", (req, res) => {
    return res.send("users page");
})

app.listen(PORT, (err) => {
    if(err) console.error(err);
    console.log(`Server is running at http://localhost:3000`)
})

function setUser(req, res, next){ 
    const userId = req.body?.userId;
    if(userId === undefined) return res.sendStatus(403);
    req.user = users.find((user) => user.id === userId);
    if(req.user === undefined) return res.sendStatus(401);
    next()
}

function checkRole(role){
    return (req, res, next) => {
        if(req.user.role != role) return res.sendStatus(403);
        next();
    }
}


