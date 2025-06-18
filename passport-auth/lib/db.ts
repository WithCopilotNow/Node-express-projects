import mongoose from "mongoose";

export async function dbConnect(): Promise<void> {
    if(mongoose.connection?.readyState === 1) return;
    if(!process.env.DATABASE_URL) throw new Error("invalid database url.");
    await mongoose.connect(process.env.DATABASE_URL);
}
