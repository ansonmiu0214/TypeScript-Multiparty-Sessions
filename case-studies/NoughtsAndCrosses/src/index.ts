// =============
// Set up server
// =============

import express from "express";
import path from "path";
import http from "http";
import WebSocket from "ws";

const app = express();
app.use(express.static(path.join(__dirname, 'client')));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// ==================
// Implement protocol
// ==================

import { Session, Svr } from './Game/Svr';
import { Coordinate as Point } from './GameTypes';
import { Games, MoveResult } from './GameLogic';

const gameManager = (gameID: string) => {

  const board = Games.initialise(gameID);

  const handleP1Move = Session.Initial({
    Pos: async (Next, move) => {
      switch (await board.p1(move)) {
        case MoveResult.Win:
          // Send losing result to P2
          return Next.Lose([move], Next => (
              // Send winning result to P1
              Next.Win([move], Session.Terminal)
          ));
        case MoveResult.Draw:
          return Next.Draw([move], Next => (
              Next.Draw([move], Session.Terminal)
          ));
        case MoveResult.Continue:
          return Next.Update([move], Next => (
              Next.Update([move], handleP2Move)
          ));
      }
    }
  });

  const handleP2Move = Session.S19({
    Pos: async (Next, move) => {
      switch (await board.p2(move)) {
        case MoveResult.Win:
          return Next.Lose([move], Next => (
            Next.Win([move], Session.Terminal)
          ));
        case MoveResult.Draw:
          return Next.Draw([move], Next => (
            Next.Draw([move], Session.Terminal)
          ));
        case MoveResult.Continue:
          return Next.Update([move], Next => (
            Next.Update([move], handleP1Move)
          ));
      }
    }
  });

  return handleP1Move;
}

// ============
// Execute EFSM
// ============

new Svr(
  wss,
  (gameID, role, reason) => {
      // Simple cancellation handler
      console.log(`${gameID}: ${role} cancelled session because of ${reason}`);
      Games.delete(gameID);
  },
  gameManager,
);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
