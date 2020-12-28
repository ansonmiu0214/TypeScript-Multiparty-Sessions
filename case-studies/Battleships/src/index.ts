import { Svr, Session } from "./Battleships/Svr";
import DB from "./GameLogic";
import { GamePlayers, MoveResult } from "./Models";

const gameManager = (gameID: string) => {

  const initial = Session.Initial({
    Init: (Next, p1Config) => Next({
      Init: (_, p2Config) => {
        DB.initialiseGame(gameID, p1Config, p2Config);
        return handleP1;
      },
    })
  });

  const handleP1 = Session.S176({
    Attack: async (Next, location) => {
      const result = await DB.attack(gameID, GamePlayers.P1, location);
      console.log(`${gameID}: player 1 attacked (${location.x}, ${location.y})...${result}!`);
      switch (result) {
        case MoveResult.Miss:
          return Next.Miss([location], Next => Next.Miss([location], handleP2));
        case MoveResult.Hit:
          return Next.Hit([location], Next => Next.Hit([location], handleP2));
        case MoveResult.Sunk:
          return Next.Sunk([location], Next => Next.Sunk([location], handleP2));
        case MoveResult.Win: 
          return Next.Winner([location], Next => Next.Loser([location], (End) => {
            DB.deleteGame(gameID);
            return End();
          }));
      }
    }
  });

  const handleP2 = Session.S179({
    Attack: async (Next, location) => {
      const result = await DB.attack(gameID, GamePlayers.P2, location)
      console.log(`${gameID}: player 2 attacked (${location.x}, ${location.y})...${result}!`);
      switch (result) {
        case MoveResult.Miss:
          return Next.Miss([location], Next => Next.Miss([location], handleP1));
        case MoveResult.Hit:
          return Next.Hit([location], Next => Next.Hit([location], handleP1));
        case MoveResult.Sunk:
          return Next.Sunk([location], Next => Next.Sunk([location], handleP1));
        case MoveResult.Win: 
          return Next.Winner([location], Next => Next.Loser([location], (End) => {
            DB.deleteGame(gameID);
            return End();
          }));
      }
    }
  });

  return initial;
};

import express from "express";
import path from "path";
import http from "http";

const app = express();
app.use(express.static(path.join(__dirname, 'client')));

const server = http.createServer(app);

import WebSocket from "ws";
const wss = new WebSocket.Server({ server });

new Svr(
  wss,
  (gameID, role, reason) => {
    console.log(`${gameID}: ${role} cancelled due to ${reason}`);
    DB.deleteGame(gameID);
  },
  gameManager
);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});