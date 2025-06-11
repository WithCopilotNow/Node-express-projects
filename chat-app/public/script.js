
const webScoket = new WebSocket(`ws://127.0.0.1:3000`);
const form = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const messageContainer = document.getElementById("message-history")

const username = prompt("Enter your name.");

webScoket.addEventListener("open", function(){
    console.log("Connected to webScoket server.")
    if(username != null) return this.send(JSON.stringify({event: "new-user", data: username}))
    return this.send(JSON.stringify({event: "new-user", data: crypto.randomUUID()}))
})

webScoket.addEventListener("message", function(event){
    const { message, center } = JSON.parse(event.data);
    appendMessage({message: message, self: false, center})
})

webScoket.addEventListener("close", function(){
    console.log("Disconnected from server.")
})

webScoket.addEventListener("error", function(err){
    console.log(`WebScoket error: ${err.message}.`)
})

form.addEventListener("submit", (event) => {
    event.preventDefault();
    webScoket.send(JSON.stringify({event: "message", data: messageInput.value}))
    appendMessage({message: messageInput.value, self: true, center: false})
    messageInput.value = ""
})

function appendMessage({message, self, center}){
    const element = document.createElement("div");
    element.textContent = message;
    if(self) element.classList.add("self");
    if(center) element.classList.add("center");
    messageContainer.append(element);
}



