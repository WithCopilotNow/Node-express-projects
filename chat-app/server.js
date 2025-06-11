import express from "express";
import http from "node:http";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import path from "node:path";
import crypto from "node:crypto";
dotenv.configDotenv();

const PORT = process.env.SERVER_PORT || 3000;
const HOSTNAME = "127.0.0.1";

const app = express();
app.use(express.static(path.join(import.meta.dirname, "public")));
const server = http.createServer(app)
const webScoketServer = new WebSocketServer({ server }); 
const users = new Map();

webScoketServer.on("connection", (webScoket) => {
    webScoket.id = crypto.randomUUID();
    webScoket.on("message", (incomingData) => {
        const { event, data } = JSON.parse(incomingData);
        if(event === "new-user"){
            users.set(webScoket.id, data);
            brodcast({message: `${data} has joined the group.`, ws: webScoket, center: true})
            return;
        }
        if(event === "message"){
            const user = users.get(webScoket.id);
            brodcast({message: `${user}: ${data}`, ws: webScoket, center: false});
            return;
        }
    })

    webScoket.on("close", () => {
        brodcast({message: `${users.get(webScoket.id)}: Disconnected`, ws: webScoket, center: true});
    })

    webScoket.on("error", (err) => {
        console.log(`WebScoket error ${err.message}`);
    })
})

server.listen(PORT, HOSTNAME, () => {
    console.log(`Server is running on http://${HOSTNAME}:${PORT}`);
    console.log(`Ws is running on ws://${HOSTNAME}:${PORT}`);
})

server.on("error", (err) => {
    console.log(`Server error ${err.message}`);
})


function brodcast({message, ws, center}){
    webScoketServer.clients.forEach((client) => {
        if(client.id === ws.id) return;
        client.send(JSON.stringify({message, center}));
    })
}