import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    title: {
        type: mongoose.Schema.Types.String,
        required: true 
    },
    lastmodified: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    description: mongoose.Schema.Types.String,
    articleBody: mongoose.Schema.Types.String,
});

articleSchema.virtual("serializeTitle").get(function(){
    return this.title.match(/[a-zA-Z0-9]+/g).join("-").toLowerCase();
})

articleSchema.virtual("dateFormat").get(function(){
    return this.lastmodified.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('/');
})

export const Article = mongoose.model("Article", articleSchema);
