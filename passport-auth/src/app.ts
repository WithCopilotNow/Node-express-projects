import express, {type NextFunction, type Request, type Response} from "express";
import { configDotenv } from "dotenv";
import { loginRoute } from "./routes/login.ts";
import { registerRoute } from "./routes/register.ts";
import { dbConnect } from "../lib/db.ts";
import mongoose from "mongoose";
import { homeRoute } from "./routes/home.ts";
import passport from "passport";
import flash from "connect-flash"
import session from "express-session";
import MongoStore from "connect-mongo";
import { userAuth } from "../utilities/middlewares.ts";
import { logoutRoute } from "./routes/logout.ts";
configDotenv();

const PORT = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 3000;
const HOST = "127.0.0.1";

dbConnect().catch((err: Error) => console.log(`Initial database connection error: ${err}`))
mongoose.connection.on("error", (err: Error) => console.log(`Database connection error: ${err}`));
mongoose.connection.once("connected", () => console.log(`Successfully connected to database.`))

const app = express();
app.set("view-engine", "ejs");

app.use(express.urlencoded({extended: true}))
app.use(flash())
app.use(session({
    name: "SessionID",
    secret: process.env.SESSION_SECRET!,
    saveUninitialized: false,
    resave: false,
    cookie: {
        signed: true,
        maxAge: 1000 * 60 * 60 * 24 * 6,
    },
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        ttl: 60 * 60 * 24 * 6,
    })
}))
app.use(passport.initialize())
app.use(passport.session())
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/logout", userAuth, logoutRoute)
app.use("/home", userAuth, homeRoute)

app.get("/", (req: Request, res: Response) => res.redirect("/home"));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err) req.flash("error", err.message);
    return res.redirect("/login");
})

app.listen(PORT, HOST, (err): void => {
    if(err) return console.error(`Server Error: ${err}`);
    console.log(`Server is running at http://${HOST}:${PORT}`);
})

