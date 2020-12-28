import React from 'react';
import './App.css';

import Context, { GameState, Cell } from "./GameState";
import Player1 from './components/Player1';
import Player2 from './components/Player2';
import { Button, Typography, Divider } from '@material-ui/core';

function App() {
  return (
    <div className="App">
      <GameState>
        <Typography style={{ marginTop: '2rem' }} gutterBottom variant='h3'>Noughts and Crosses</Typography>
        <Divider style={{ marginBottom: '2rem' }} />
        <Context.Consumer>
          {(context) => {
            if (context.myMarker === undefined) {
              return (
                <div>
                <Button
                  style={{ marginLeft: '10px', marginRight: '10px', }}
                  variant='contained'
                  color='primary'
                  onClick={() => context.setMyMarker(Cell.P1)}
                  >
                    Select Noughts (O's)
                </Button>
                <Button
                  style={{ marginLeft: '10px', marginRight: '10px', }}
                  variant='contained'
                  color='secondary'
                  onClick={() => context.setMyMarker(Cell.P2)}
                  >
                    Select Crosses (X's)
                </Button>
              </div>
              );
            } else if (context.myMarker === Cell.P1) {
              return <Player1 />
            } else {
              return <Player2 />
            }
          }}
        </Context.Consumer>
      </GameState>
    </div>
  );
}

export default App;
