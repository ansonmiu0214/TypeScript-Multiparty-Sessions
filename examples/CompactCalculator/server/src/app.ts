import { Svr } from "./CompactCalculator/Svr";
import { Implementation, Labels } from "./CompactCalculator/EFSM";
import WebSocket from "ws";

const handler: Implementation.Initial = new Implementation.Initial({
  [Labels.S44.Add]: (x, y) => {
    console.log('adding', x, y, '...');
    return new Promise((resolve, reject) => {
      if (x === 0 || y === 0) {
        return reject('Zero operand received');
      }
      setTimeout(() => {
        console.log('...result send!');
        resolve(new Implementation.S46([Labels.S46.Res, [x + y], handler]));
      }, 5000);
    });
  },
  [Labels.S44.Double]: (x) => {
    console.log('doubling', x, '...');
    throw new Error(':(');
    console.log('...result send!');

    return new Implementation.S48([Labels.S48.Res, [2*x], handler]);
  },
  [Labels.S44.Mult]: (x, y) => {
    console.log('multiplying', x, y, '...');
    console.log('...result send!');
    return new Implementation.S47([Labels.S47.Res, [x * y], handler]);
  },
  [Labels.S44.Quit]: () => {
    console.log('quiting received...');
    return new Promise((resolve, _) => {
      setTimeout(() => {
        console.log('...terminate send!');
        resolve(new Implementation.S49([Labels.S49.Terminate, [], new Implementation.Terminal()]));
      }, 3000);
    })
  }
})

import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

new Svr(wss, handler, (role, reason) => {
  console.error(`${role} cancelled because: ${reason}`);
});

server.listen(8080, () => console.log(`Listening on 8080...`))