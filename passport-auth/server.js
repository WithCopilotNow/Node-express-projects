import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import { registerRoute } from "./routes/register.js";
import { loginRoute } from "./routes/login.js";
import flash from "connect-flash";
import session from "express-session"
import MongoStore from "connect-mongo";
import passport from "passport";
import { routeThrough } from "./utilities/middlewares/route-trough.js";
import { mountMessages } from "./utilities/middlewares/mountMessage.js";
import { logoutRoute } from "./routes/logout.js";
dotenv.config();

mongoose.connect(process.env.SERVER_URL);
export const db = mongoose.connection;
db.on("error", (err) => {
    console.error(`Error while connecting to an database ${err.message}`);
})
db.once("connected", () => {
    console.log("Connected to database.");
})

const app = express();
const port = process.env.PORT || 3000;

app.set("view-engine", "ejs");
app.use(express.urlencoded());
app.use(flash())
app.use(session({
    name: "SessionID",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        signed: true,
        maxAge: 1000 * 60 * 60 * 6
    },
    store: MongoStore.create({
        client: db.getClient(),
        ttl: 60 * 60 * 6
    })
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(mountMessages)
app.use(routeThrough)

app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/logout", logoutRoute);

app.get("/", (req, res) => {
    res.render("index.ejs", { name: "inaho" });
})

app.listen(port, (err) => {
    if(err) return console.error(err)
    console.log(`Server is listening in port ${port}`);
});







