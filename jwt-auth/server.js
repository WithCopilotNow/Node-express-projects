const dotenv = require("dotenv")
const express = require("express");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
app.use(express.json())

const port = process.env.PORT || 3000;

const posts = [
    {
        username: "Slaine",
        title: "post 1"
    },
    {
        username: "Inaho",
        title: "aldnoah"
    }
]

app.get("/posts", authenticate, (req, res) => {
    return res.json(posts.filter((post) => post.username === req.user.name))
})

app.listen(port, (err) => {
    if(err){
        console.log(`Server error ${err.message}`)
    }
    console.log(`Server is listening on port ${process.env.PORT}`)
})


function authenticate(req, res, next){
    const [, token] = req.headers["authorization"].split(" ");
    if(token === null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next()
    })
}