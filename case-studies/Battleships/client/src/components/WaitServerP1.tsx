import React from "react";

import GameBoard from "../GameManager/GameBoard";
import GameState, { GamePlayers } from "../GameManager/GameState";

import S131 from "../Battleships/P1/S131";
import { Location, CellState } from "../Models";

export default class WaitServer extends S131 {

  static contextType = GameState;
  declare context: React.ContextType<typeof GameState>;

  Hit(location: Location) {
    this.context.updateFoeBoard([[location, CellState.Hit]]);
    this.context.updateMessage('You hit!');
  }

  Miss(location: Location) {
    this.context.updateFoeBoard([[location, CellState.Miss]]);
    this.context.updateMessage('You miss!');
  }

  Sunk(location: Location) {
    this.context.updateFoeBoard([[location, CellState.Hit]]);
    this.context.updateMessage('You sunk a ship!');
  }

  Winner(location: Location) {
    this.context.updateFoeBoard([[location, CellState.Hit]]);
    this.context.setWinner(GamePlayers.ME);
  }

  render() {
    return (
      <div className='container'>
        <div>
          <h2>Foe Board</h2>
          <GameBoard
            player={GamePlayers.FOE}
          />
        </div>
        <div>
          <h3>My Board</h3>
          <GameBoard
            player={GamePlayers.ME}
          />
        </div>
      </div>
    );
  }
}