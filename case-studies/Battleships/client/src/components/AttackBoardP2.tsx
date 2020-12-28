import React from "react";

import GameBoard from "../GameManager/GameBoard";
import { GamePlayers } from "../GameManager/GameState";

import { S223 } from "../Battleships/P2/";
import { Location } from "../Models";

export default class AttackBoard extends S223 {

  render() {
    const Attack = (location: Location) => this.Attack('onClick', (ev) => {
      return [location];
    });

    return (
      <div className='container'>
        <div className='active'>
          <h2>Foe Board <span className='badge'>your turn</span></h2>
          <GameBoard
            player={GamePlayers.FOE}
            onEmptyWrapper={Attack}
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