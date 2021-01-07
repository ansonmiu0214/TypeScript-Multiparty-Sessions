import React from 'react';
import { S34 } from '../../Game/P1';
import Context, { Cell, Result } from '../../GameState';

import { Coordinate as Point } from '../../GameTypes';
import Board from '../Board';
import { CircularProgress } from '@material-ui/core';

export default class WaitOpponent extends S34 {

  static contextType = Context;
  declare context: React.ContextType<typeof Context>;

  Lose(point: Point) {
    this.context.updateMove(Cell.P2, point);
    this.context.setResult(Result.Lose);
  }

  Draw(point: Point) {
    this.context.updateMove(Cell.P2, point);
    this.context.setResult(Result.Draw);
  }

  Update(point: Point) {
    this.context.updateMove(Cell.P2, point);
  }

  render() {
    return <div>
      <Board />
      <CircularProgress />
    </div>
  }
}