import React from "react";

import { S220 } from "../Battleships/P2";
import InitialiserBoard from "../GameManager/InitialiserBoard";

export default class InitialiserP2 extends S220 {
  
  render() {
    return (
      <InitialiserBoard
        makeSubmitConfigButton={(config) => this.Init('onClick', ev => [config])}
      />
    );
  }
}