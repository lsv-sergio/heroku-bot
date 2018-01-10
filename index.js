const express = require("express");
const bot_connector = require("./js/bot_connector").connector;
const app = express();

app.get("/", function(request, response) 
{
    response.send("<h1>It work</h1>");
});

app.post("/api/messages", bot_connector.listen());

app.listen(process.env.PORT || 8080);