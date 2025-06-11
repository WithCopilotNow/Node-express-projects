const dotenv = require("dotenv")
const express = require("express");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
app.use(express.json())

const port = process.env.AUTH_PORT || 4000;

let refreshTokens = []

app.post("/token", (req, res) => {
    const token = req.body.token;
    if(token === null) return res.sendStatus(401);
    if(!refreshTokens.includes(token)) return res.sendStatus(403);
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        const newAccessToken = generateAccessToken({name: user.name})
        return res.json({accessToken: newAccessToken});
    })
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const user = { name: username };
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    const accessToken = generateAccessToken(user);
    return res.json({accessToken, refreshToken})
})

app.delete("/logout", (req, res) => {
    refreshTokens = refreshTokens.filter((token) => token != req.body.token);
    return res.sendStatus(204);
})

app.listen(port, (err) => {
    if(err){
        console.log(`Server error ${err.message}`)
    }
    console.log(`Server is listening on port ${process.env.AUTH_PORT}`)
})


function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15s"})
}