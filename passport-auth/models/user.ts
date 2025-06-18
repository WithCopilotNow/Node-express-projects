import mongoose from "mongoose";
import z from "zod/v4"

type InitialUserType = {
    _id?: mongoose.Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date,
    username: string,
    email: string,
    password: string
}

const userSchema = new mongoose.Schema<InitialUserType>({
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    email: {
        type: mongoose.Schema.Types.String,
        unique: true,
        sparse: true,
        required: true
    },
    password: {
        type: mongoose.Schema.Types.String,
        unique: true,
        sparse: true,
        required: true
    }
}, {id: false, toObject: {virtuals: true}, toJSON: {virtuals: true}, timestamps: true})

export const ExpressUser: mongoose.Model<InitialUserType> = mongoose.models?.UserModel || mongoose.model("ExpressUser", userSchema);

export const dbUserSchema = z.object({
    _id: z.instanceof(mongoose.Types.ObjectId, {message: "invalid ObjectId"})
        .transform((val) => val.toHexString()),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    username: z.string('Username is required'),
    email: z.email('Invalid email address'),
    password: z.string('Password is required')
})

export type DbUserType = z.infer<typeof dbUserSchema>;
