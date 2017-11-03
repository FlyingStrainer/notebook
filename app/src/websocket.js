
var WebSocketServer = require("ws").Server;

function attachWs(app, server) {
  var userId;
  var wss = new WebSocketServer({server: server});
  wss.on("connection", function (ws) {
    // const location = url.parse(req.url, true);

    console.log("websocket connection open");

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
}

exports.attach = attachWs;
