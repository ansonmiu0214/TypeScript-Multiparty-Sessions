import express from 'express';
import http from 'http';
import WebSocket from 'ws';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

import { Svr } from './TwoBid/Svr';
import { Implementation, Labels } from './TwoBid/EFSM';

new Svr(wss, new Implementation.S7({
  'Bid': (bid) => {
    console.log('Received:', bid);
    return new Implementation.S9({
      'TwoBids': (bid1, bid2) => {
        const maxBid = Math.max(bid, bid1, bid2);
        if (maxBid === bid) {
          return new Implementation.S10([Labels.S10.Win, [], new Implementation.S11([Labels.S11.Lose, [], new Implementation.S8('Terminate')])]);
        } else {
          return new Implementation.S10([Labels.S10.Lose, [], new Implementation.S12([Labels.S12.Win, [], new Implementation.S8('Terminate')])]);
        }
      }
    })
  }
}));

server.listen(8080, () => console.log('Listening on port 8080...'));