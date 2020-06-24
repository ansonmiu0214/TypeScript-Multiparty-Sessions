import express from 'express';
import http from 'http';
import WebSocket from 'ws';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

import { S } from './TwoBuyer/S';
import { Implementation, Labels } from './TwoBuyer/EFSM';


const handler: Implementation.S29 = new Implementation.S29({
  title: (title) => {
    console.log('Received title', title);
    const quote = 100;

    return new Promise((resolve, reject) => {
      setTimeout(() => {

        reject('Bad quote');
        return;

        resolve(new Implementation.S31([
          Labels.S31.quote,
          [quote],
          new Implementation.S32([
            Labels.S32.quote,
            [quote],
            new Implementation.S33({
              ok: (address) => {
                console.log('B confirmed: deliver to address', address);
                const date = '01/01/2020';
                return new Implementation.S34([Labels.S34.date, [date], new Implementation.Terminal()]);
    
              },
              quit: () => {
                return new Implementation.Terminal();
              },
            })
          ]),
        ]));
      }, 3000);
    })

    
  }  
})

new S(wss, handler, (role, reason) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(role, 'cancelled because', reason);
      resolve();
    }, 5000);
  })
});

server.listen(8080, () => console.log('Listening on port 8080...'));