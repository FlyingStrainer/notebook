var WebSocketServer = require("ws").Server;

module.exports = function addWSS(server) {
  var wss = new WebSocketServer({server: server});
  wss.on("connection", function (ws) {
    // const location = url.parse(req.url, true);
    var userId;

    console.info("websocket connection open");

    var timestamp = new Date().getTime();
    userId = timestamp;

    ws.send(JSON.stringify({msgType:"onOpenConnection", msg:{connectionId:timestamp}}));

    ws.on("message", function incoming(data, flags) {
      var clientMsg = data;
      console.log('received: %s', clientMsg);

      ws.send(JSON.stringify({msg:{connectionId:userId}}));
    }); 

    ws.on("close", function () {
      console.log("websocket connection close");
    }); 
  }); 

  console.log("websocket server created");

  return wss;
}
