import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/userModel.js";
import { scrypt } from "../routes/register.js";
import crypto from "node:crypto";

async function comparePassword({hashPassword, unHashPassword}) {
    const [saltBase64, passwordBase64] = hashPassword.split("_");
    const salt = Buffer.from(saltBase64, "base64");
    const oldHash = Buffer.from(passwordBase64, "base64");
    const upcomingHash = await scrypt(unHashPassword, salt, 32);
    const isEqual = crypto.timingSafeEqual(oldHash, upcomingHash);
    return isEqual;
}

async function verification(email, password, done){
    try {
        const user = await User.findOne({email});
        if(!user) return done(null, false, { message: "User Not Found" });
        const isEqual =  await comparePassword({hashPassword: user.password, unHashPassword: password});
        if(!isEqual) return done(null, false, { message: "Bad Credentials" });;
        return done(null, user);
    } catch (error) {
        return done(error, false)
    }
}

export default passport.use(new LocalStrategy({usernameField: "email"}, verification));

passport.serializeUser(({_id: id}, done) => {
    return done(null, id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findOne({_id: id});
        if(!user) return done(null, false, { message: "User not found" });
        return done(null, user)
    } catch (error) {
        return done(error, false)
    }
})