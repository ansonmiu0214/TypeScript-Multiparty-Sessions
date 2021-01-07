import React from 'react';
import { S33 } from '../../Game/P1';
import Context, { Cell, Result } from '../../GameState';

import { Coordinate as Point } from '../../GameTypes';
import Board from '../Board';
import { CircularProgress } from '@material-ui/core';

export default class WaitServer extends S33 {

  static contextType = Context;
  declare context: React.ContextType<typeof Context>;

  Win(point: Point) {
    this.context.setResult(Result.Win);
  }

  Draw(point: Point) {
    this.context.setResult(Result.Draw);
  }

  Update(point: Point) {
    
  }

  render() {
    return <div>
      <Board />
      <CircularProgress />
    </div>
  }
}