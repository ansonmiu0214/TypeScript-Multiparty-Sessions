import express from 'express';
import WebSocket from 'ws';
import http from 'http';

const Browser = require('zombie');

import { Svr } from './PingPong/Svr';
import { Implementation, Labels } from './PingPong/EFSM';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const MSGS = Number(process.env.MSGS) || 10;

const LABEL = 'benchmark';

const logic: Implementation.Initial = new Implementation.Initial({
  PING: (count) => {
    console.timeLog(LABEL, ++count);
    if (count === MSGS) {
      return new Implementation.S16([Labels.S16.BYE, [count], new Implementation.Terminal()]);
    } else {
      return new Implementation.S16([Labels.S16.PONG, [count], logic]);
    }
  }
});

new Svr(wss, logic, (role, reason) => {
  console.error(`${role} cancelled because of ${reason}`);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);

  new Browser().visit('http://localhost:3000', () => {
    console.log('Loaded page');
  });
});