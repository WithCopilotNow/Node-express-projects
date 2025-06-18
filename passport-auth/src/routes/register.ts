import express, {type Request, type Response} from "express";
import { ExpressUser } from "../../models/user.ts";
import crypto from "node:crypto";
import util from "node:util"
import z from "zod/v4";

export const registerRoute = express.Router();
export const scrypt: (password: crypto.BinaryLike, salt: crypto.BinaryLike, keyLen: number) => Promise<Buffer> = util.promisify(crypto.scrypt)

const userDataSchema = z.object({
    username: z
        .string('Username is required')
        .trim()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username cannot exceed 30 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, or hyphens'),
    email: z
        .email('Invalid email address')
        .trim()
        .toLowerCase()
        .max(255, 'Email cannot exceed 255 characters'),
    password: z
        .string('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password cannot exceed 128 characters')
        .regex(/[A-Z]/, 'Password must include an uppercase letter')
        .regex(/[a-z]/, 'Password must include a lowercase letter')
        .regex(/[0-9]/, 'Password must include a number')
        .regex(/[^A-Za-z0-9]/, 'Password must include a special character'),
})

registerRoute.route("/")
.get((req: Request, res: Response) => {
    res.render("register.ejs")
})
.post(async (req: Request, res: Response) => {
    try {
        const parsedUserData = userDataSchema.parse(req.body);
        const salt = crypto.randomBytes(32);
        const keyLen = 64;
        const hashPassword = await scrypt(parsedUserData.password, salt, keyLen);
        const userData: z.infer<typeof userDataSchema> = {
            username: parsedUserData.username,
            email: parsedUserData.email,
            password: `${salt.toString("hex")}_${hashPassword.toString("hex")}`
        }
        await ExpressUser.create(userData);
        res.redirect("/login")
    } catch (err) {
        console.log(`Error while creating new user: ${err}`)
        res.redirect("/register");
    }
})