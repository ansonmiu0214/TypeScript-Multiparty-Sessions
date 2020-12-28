import React from "react";

import GameBoard from "../GameManager/GameBoard";
import { GamePlayers } from "../GameManager/GameState";
import { S129 } from "../Battleships/P1";

export default class EndGame extends S129 {

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
    )
  }
}