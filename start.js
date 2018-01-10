var express = require('express');

var app = express();

app.get("/", function(request, response) 
{
    response.send("<h1>It work</h1>");
});

app.listen(process.env.PORT || 8080);