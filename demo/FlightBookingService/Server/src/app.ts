import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import { Server } from './FlightBooking/Server';
import { Roles, Implementation, Labels } from './FlightBooking/EFSM';
import { cancelSeat, checkAvailable } from './FlightChecker';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const logic: Implementation.Initial = new Implementation.Initial({
  [Labels.S17.Destination]: async (dest) => {
    const result = await checkAvailable(dest);
    if (result.available) {
      return new Implementation.S19([
        Labels.S19.Available, [result.price], new Implementation.S20({
          [Labels.S20.Confirm]: (cred) => {
            console.log(`Name: ${cred.name}`);
            console.log(`Credit card: ${cred.creditCard}`);
            return new Implementation.Terminal();
          },
          [Labels.S20.Reject]: () => {
            cancelSeat(dest);
            return new Implementation.Terminal();
          },
        })
      ])
    } else {
      return new Implementation.S19([
        Labels.S19.Full, [], logic
      ]);
    }
  }
});

new Server(wss, logic, async (role, reason) => {
  if (role === Roles.Peers.Traveller) {
    await cancelSeat();
  }
})

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));