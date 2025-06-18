import express, {type Request, type Response} from "express";

export const logoutRoute = express.Router();

logoutRoute.post("/", (req: Request, res: Response) => {
    req.logout({keepSessionInfo: false}, (err) => {
        if(err) console.error(`User logout error: ${err}`);
        return res.redirect("/login");
    });
})

