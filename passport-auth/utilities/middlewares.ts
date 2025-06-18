import { type NextFunction, type Response, type Request } from "express";

export function userAuth(req: Request, res: Response, next: NextFunction): void{
    if(!req.isAuthenticated()) return res.redirect("/login");
    next();
} 