import React from 'react';
import { S44 } from '../../Game/P2';

import Board from '../Board';
import { Coordinate as Point } from '../../GameTypes';
import Context, { Cell } from '../../GameState';

export default class MakeMove extends S44 {

  static contextType = Context;
  declare context: React.ContextType<typeof Context>;
  
  render() {
    const MakeMove = (point: Point) => this.Pos('onClick', ev => {
      this.context.updateMove(Cell.P2, point);
      return [point];
    });
    
    return <div>
      <Board makeMove={MakeMove} />
      <h2>Make Move!</h2>
    </div>
  }

}