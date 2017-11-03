
const WebSocketServer = require('ws').Server;

function attach(app, server) {
  const wss = new WSServer({
    server,
  });

  server.on('request', app);

  wss.on('connection', function connection(ws) {

    var userId = new Date().getTime();
    ws.send(JSON.stringify({msgType:"onOpenConnection", msg:{connectionId:timestamp}}));
    console.log(`ws ${userId} connected`);

    ws.on('message', function incoming(message) {
      console.log(`received: ${message}`);

      ws.send(JSON.stringify({msg:{connectionId:userId}}));
    });

    ws.on('close', function () {
      console.log(`ws ${userId} closed`);
    });
  });
}

exports.attach = attach;
