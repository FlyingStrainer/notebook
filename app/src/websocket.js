
const WebSocketServer = require('ws').Server;

module.exports = function addWSS(server) {
  const wss = new WebSocketServer({server});
  wss.on('connection', (ws) => {
    // const location = url.parse(req.url, true);

    console.info('websocket connection open');

    const timestamp = new Date().getTime();
    const userId = timestamp;

    ws.send(JSON.stringify({
      msgType: 'onOpenConnection',
      msg: {
        connectionId: timestamp,
      },
    }));

    ws.on('message', function incoming(data) {
      const clientMsg = data;
      console.log('received: %s', clientMsg);

      ws.send(JSON.stringify({msg: {connectionId: userId}}));
    });

    ws.on('close', () => {
      console.log('websocket connection close');
    });
  });

  console.log('websocket server created');

  return wss;
};
