import express from "express";
import path from "path";
import http from "http";
import WebSocket from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, "client")));

import { Session, S, Role } from "./TravelAgency/S";
import { confirmBooking, checkAvailability, resetBookings, release, tryRelease } from "./AgencyProvider";

app.get('/reset', (_, res) => {
  resetBookings();
  res.send('OK');
})

const agencyProvider = (sessionID: string) => {
  const handleQuery = Session.Initial({
    Query: async (Next, destination) => {
      const response = await checkAvailability(sessionID, destination);
      if (response.status === "available") {
        return Next.Available([response.quote], Next => (
          Next({
            Confirm: async (End, credentials) => {
              // Handle confirmation
              await confirmBooking(sessionID, credentials);
              return End();
            },
            Reject: async (End) => {
              await release(sessionID);
              return End();
            },
          })
        ));
      } else {
        return Next.Full([], handleQuery);
      }
    },
  });

  return handleQuery;
};

new S(
  wss,
  async (sessionID, role, reason) => {
    if (role === Role.Self) {
      console.error(`${sessionID}: internal server error`);
    } else {
      await tryRelease(sessionID);
    }
  },
  agencyProvider,
);


const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});