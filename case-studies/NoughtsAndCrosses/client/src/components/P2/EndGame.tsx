import React from 'react';
import { S43 } from '../../Game/P2';
import Context, { Result } from '../../GameState';

import Board from '../Board';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Container } from '@material-ui/core';

export default class Endgame extends S43 {

  static contextType = Context;
  declare context: React.ContextType<typeof Context>;

  render() {
    return (
      <div>
        <Board />
        <Container>
        {this.context.winner === Result.Win && 
          <Alert severity='success'>
            <AlertTitle>You won!</AlertTitle>
          </Alert>}
        {this.context.winner === Result.Draw && 
          <Alert severity='info'>
            <AlertTitle>Draw!</AlertTitle>
          </Alert>}
        {this.context.winner === Result.Lose &&
          <Alert severity='warning'>
            <AlertTitle>You lose!</AlertTitle>
          </Alert>}
        </Container>
      </div>
    )
  }
}