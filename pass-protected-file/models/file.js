import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    path: {
        type: String,
        required: true,
    },
    originalName: {
        type: String,
        required: true,
    },
    downloardCounts: {
        type: Number,
        default: 0
    },
    password: String,
})

export const File = mongoose.model("File", fileSchema);