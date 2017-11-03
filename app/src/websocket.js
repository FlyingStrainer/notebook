
const WebSocketServer = require('ws').Server;
const server = require('http').createServer();

function attach(app) {
  const wss = new WSServer({
    server,
  });

  server.on('request', app);

  wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
      console.log(`received: ${message}`);

      ws.send(JSON.stringify({
        answer: 42,
      }));
    });
  });
}

exports.attach = attach;
