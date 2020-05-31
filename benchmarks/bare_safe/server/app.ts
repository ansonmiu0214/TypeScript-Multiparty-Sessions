import express from 'express';
import WebSocket from 'ws';
import http from 'http';

const Browser = require('zombie');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const MSGS = Number(process.env.MSGS) || 10;

const LABEL = 'benchmark';

wss.on('close', (event: WebSocket.CloseEvent) => {
  console.timeEnd(LABEL);
});

wss.on('connection', (socket) => {
  console.time(LABEL);

  socket.onmessage = ({ data }) => {
    const { label, payload } = JSON.parse(data.toString());
    if (label === 'PING') {
      let count: number = payload[0];
      console.timeLog(LABEL, ++count);
      if (count === MSGS) {
        socket.send(JSON.stringify({
          label: 'BYE',
          payload: [count],
        }));
      } else {
        socket.send(JSON.stringify({
          label: 'PONG',
          payload: [count],
        }));
      }
    } else {
      throw new Error(`Unrecognised label: ${label}`)
    }
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);

  new Browser().visit('http://localhost:3000', () => {
    console.log('Loaded page');
  });
  
});
