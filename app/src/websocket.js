
var WebSocketServer = require("ws").Server;

// 5 sec timeout

function attachWs(app, server) {
  var wss = new WebSocketServer({server: server});

  var connections = [];

  wss.pushToAll = function pushToAll(users, notebook_hash, entry_hash) {
    users.forEach(function each(target_user_hash) {
      connections.forEach(function each(pair) {
        const ws = pair[0];
        const ws_user_hash = pair[1];
        if (target_user_hash == ws_user_hash) {
          if (ws.readyState === 1) {
            ws.send(JSON.stringify({type:'push',msg:{notebook_hash, entry_hash}}));
          }
        }
      });
    });
  };

  // putToAll using firebase

  wss.on("connection", function (ws) {
    console.log("websocket connection open");

    let login = false;
    let failed = false;

    setTimeout(() => {
      if (!login) {
        failed = true;
        ws.send(JSON.stringify({type:'failed'}));
        ws.close();
      }
    }, 10 * 1000);

    const timestamp = new Date().getTime();
    const userId = timestamp

    ws.on("message", function incoming(message, flags) {
      var data = JSON.parse(message);
      console.log('received: ', data);

      if (data.type === 'login') {
        const user_hash = data.user_hash;
        if (!(user_hash) || failed) {
          failed = true;
          ws.send(JSON.stringify({type:'failed'}));
        }
        else {
          login = true;
          ws.send(JSON.stringify({type:'login',msg:user_hash}));
          connections.push([ws, user_hash]);
        }
      }
      if (data.type === 'testpush') {
        let myhash = undefined;
        for (var i = 0; i < connections.length; i++) {
          const pair = connections[i];
          if (ws == pair[0]) {
            myhash = pair[1];
            break;
          }
        }
        wss.pushToAll([myhash, '--user-key-1', '--manager-key-1'],
          '--notebook-key-1', '--data-entry-key-1');
      }

      // add connection test to value
    });

    ws.on('close', function () {
      console.log('websocket connection close');
      ws.close();

      // for (var i = 0; i < connections.length; i++) {
      //   const pair = connections[i];
      //   if (ws == pair[0]) {
      //     // remove from connections
      //     break;
      //   }
      // }
    });
  });

  return wss;
}

exports.attach = attachWs;
