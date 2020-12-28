import React from 'react';
import './App.css';

import GameState, { GameProvider } from './GameManager/GameState';
import { GamePlayers } from './Models';

import AttackBoardP1 from './components/AttackBoardP1';
import AttackBoardP2 from './components/AttackBoardP2';
import WaitServerP1 from './components/WaitServerP1';
import WaitOppositionP1 from './components/WaitOppositionP1';
import WaitServerP2 from './components/WaitServerP2';
import WaitOppositionP2 from './components/WaitOppositionP2';
import EndGame from './components/EndGame';

import { P1 } from './Battleships/P1';
import { P2 } from './Battleships/P2';
import InitialiserP1 from './components/InitialiserP1';
import InitialiserP2 from './components/InitialiserP2';

function App() {
  const origin =  process.env.REACT_APP_PROXY ?? window.location.origin;
  const endpoint = origin.replace(/^http/, 'ws');
  const [player, setPlayer] = React.useState<GamePlayers>();

  return (
    <GameProvider>
    <div className="App">
      {player === undefined &&
        <div>
        <h3>Choose Player</h3>
        <button onClick={() => setPlayer(GamePlayers.P1)}>P1</button>
        <button onClick={() => setPlayer(GamePlayers.P2)}>P2</button>
        </div>
      }

      <GameState.Consumer>
        {({ message }) => <p><code>{message}</code></p>}
      </GameState.Consumer>

      {player === GamePlayers.P1 && 
        <P1
          endpoint={endpoint}
          states={{
            S128: InitialiserP1,
            S130: AttackBoardP1,
            S131: WaitServerP1,
            S132: WaitOppositionP1,
            S129: EndGame,
          }}
          waiting={<p>Waiting for Player 2...</p>}
          cancellation={(role, reason) => {
            return <p className='error'>Error: {role} cancelled... {reason}</p>;
          }}
          connectFailed={<p>Connection Failed</p>}
        />
      }

      {player === GamePlayers.P2 && 
        <P2
          endpoint={endpoint}
          states={{
            S220: InitialiserP2,
            S222: WaitOppositionP2,
            S223: AttackBoardP2,
            S224: WaitServerP2,
            S221: EndGame,
          }}
        waiting={<p>Waiting for Player 1...</p>}
        cancellation={(role, reason) => {
          return <p className='error'>Error: {role} cancelled... {reason}</p>;
        }}
        connectFailed={<p className='error'>Connection Failed</p>}
      />
      }
    </div>
    </GameProvider>
  );
}

export default App;
