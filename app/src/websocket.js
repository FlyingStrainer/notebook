
var WebSocketServer = require("ws").Server;

// 5 sec timeout

function attachWs(app, server) {
  var userId;
  var wss = new WebSocketServer({server: server});
  wss.on("connection", function (ws) {
    // const location = url.parse(req.url, true);

    console.log("websocket connection open");

    var timestamp = new Date().getTime();
    userId = timestamp;

    ws.send(JSON.stringify({msgType:"onOpenConnection", msg:{connectionId:timestamp}}));

    ws.on("message", function incoming(message, flags) {
      var data = JSON.parse(message);
      console.log('received: %s', data);

      const user_hash = data.user_hash;

      // close if not manager

      // add connection test to value

      ws.send(JSON.stringify({msg:{connectionId:user_hash}}));
    });

    ws.on("close", function () {
      console.log("websocket connection close");
    });
  });
}

exports.attach = attachWs;
