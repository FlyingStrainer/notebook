var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var bodyParser = require('body-parser');
var port = process.env.PORT || 5000;


var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.get('/someGetRequest', function(req, res, next) {
   console.log('receiving get request');
});
app.post('/somePostRequest', function(req, res, next) {
   console.log('receiving post request');
   res.setHeader('Content-Type', 'text/plain');
   res.end(JSON.stringify(req.body, null, 2));
});
app.listen(80); //port 80 need to run as root

console.log("app listening on %d ", 80);

var server = http.createServer(app);
server.listen(port);

console.log("http server listening on %d", port);

var userId;
var wss = new WebSocketServer({server: server});
wss.on("connection", function (ws) {
  //  const location = url.parse(req.url, true);

   console.info("websocket connection open");

   ws.on('message', function incoming(message) {
      console.log('received: %s', message);
   });

   ws.send('something');

   // var timestamp = new Date().getTime();
   // userId = timestamp;
   //
   // ws.send(JSON.stringify({msgType:"onOpenConnection", msg:{connectionId:timestamp}}));
   //
   //
   // ws.on("message", function (data, flags) {
   //     console.log("websocket received a message");
   //     var clientMsg = data;
   //
   //     ws.send(JSON.stringify({msg:{connectionId:userId}}));
   // });

   ws.on("close", function () {
      console.log("websocket connection close");
   });
});

console.log("websocket server created");
