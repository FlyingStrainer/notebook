
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
      console.log('received: ', data);

      if (data.type === 'login') {
        const user_hash = data.user_hash;
        if (!(user_hash)) {
          ws.send(JSON.stringify({type:'failed'}));
        }
        else {
          ws.send(JSON.stringify({type:'login',msg:user_hash}));
        }
      }
      if (data.type === 'testpush') {
        const notebook_hash = '--notebook-key-1';
        const entry_hash = '--data-entry-key-1';
        ws.send(JSON.stringify({type:'push',msg:{notebook_hash, entry_hash}}));
      }


      // add connection test to value

    });

    ws.on("close", function () {
      console.log("websocket connection close");
    });
  });
}

exports.attach = attachWs;
