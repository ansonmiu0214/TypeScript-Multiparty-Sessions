import React from "react";
import GameBoard from "../GameManager/GameBoard";
import GameState, { GamePlayers } from "../GameManager/GameState";

import S132 from "../Battleships/P1/S132";
import { CellState, Location } from "../Models";

export default class WaitOpposition extends S132 {

  static contextType = GameState;
  declare context: React.ContextType<typeof GameState>;

  Hit(location: Location) {
    this.context.updateMyBoard([[location, CellState.Hit]]);
    this.context.updateMessage('FOE hit you!');
  }

  Miss(location: Location) {
    this.context.updateMyBoard([[location, CellState.Miss]]);
    this.context.updateMessage('FOE missed!');
  }

  Sunk(location: Location) {
    this.context.updateMyBoard([[location, CellState.Hit]]);
    this.context.updateMessage('FOE sunk your ship!');
  }

  Loser(location: Location) {
    this.context.updateMyBoard([[location, CellState.Hit]]);
    this.context.setWinner(GamePlayers.FOE);
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
          <h3>My Board <span className='badge'>waiting for FOE...</span></h3>
          <GameBoard
            player={GamePlayers.ME}
          />
        </div>
      </div>
    );
  }
}