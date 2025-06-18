import passport, { type DoneCallback } from "passport";
import { Strategy as LocalStrategy} from "passport-local";
import { dbUserSchema, ExpressUser } from "../models/user.ts";
import { scrypt } from "../src/routes/register.ts";
import { timingSafeEqual } from "node:crypto";
import mongoose from "mongoose";

async function isEqual(hashPasswordWithSalt: string, rawPassword: string): Promise<boolean> {
    const [salt, oldHashPassword] = hashPasswordWithSalt.split("_");
    const parsedSalt = Buffer.from(salt, "hex");
    const keyLen = 64;
    const parsedPassword = Buffer.from(oldHashPassword, "hex");
    const hashPassword = await scrypt(rawPassword, parsedSalt, keyLen);
    const equal = timingSafeEqual(parsedPassword, hashPassword);
    return equal;
}

async function verify(email: string, password: string, done: DoneCallback): Promise<void>{
    try {
        const dbUser = await ExpressUser.findOne({email}).lean();
        if(!dbUser) return done(null, false, { message: "User not found." });
        const parsedUser = dbUserSchema.parse(dbUser);
        const equal = await isEqual(parsedUser.password, password);
        if(!equal) return done(null, false, { message: "Unauthorized wrong password." });
        return done(null, parsedUser);
    } catch (err) {
        console.error(`User Verification Error: ${err instanceof Error ? err.message : `Unknown Error: ${err}`}`);
        return done(err, false);
    }
}

export default passport.use(new LocalStrategy({usernameField: "email", passwordField: "password"}, verify))

passport.serializeUser((user, done) => { done(null, user._id) });
passport.deserializeUser(async (id: string, done: DoneCallback) => {
    try {
        const dbUser = await ExpressUser.findOne({_id: new mongoose.Types.ObjectId(id)});
        if(!dbUser) return done(null, false, {message: "User not found while deserializing."});
        const parsedUser = dbUserSchema.parse(dbUser);
        return done(null, parsedUser);
    } catch (err) {
        console.error(`Error while deserializing user: ${err instanceof Error ? err.message : `Unknown error: ${err}`}`);
        return done(err, false);
    }
})