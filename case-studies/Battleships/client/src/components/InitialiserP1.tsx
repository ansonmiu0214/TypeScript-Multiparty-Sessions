import React from "react";

import { S17 } from "../Battleships/P1";
import InitialiserBoard from "../GameManager/InitialiserBoard";

export default class InitialiserP1 extends S17 {
  render() {
    return (
      <InitialiserBoard
        makeSubmitConfigButton={(config) => this.Init('onClick', ev => [config])}
      />
    );
  }
}