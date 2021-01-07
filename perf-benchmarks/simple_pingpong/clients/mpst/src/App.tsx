import React from 'react';
import './App.css';

import { Client } from './PingPong/Client';
import BenchmarkContext, { Benchmark } from './Benchmark';
import Send from './components/Send';
import Terminal from './components/Terminal';
import Receive from './components/Receive';

function App() {
  return (
    <div className="App">
      <Benchmark>
        <div style={{ display: 'flex'}}>
          <div style={{ flex: 1 }}>
            <Client
              endpoint='ws://localhost:8080'
              states={{
                S5: Send,
                S6: Terminal,
                S7: Receive,
              }}
              waiting={<p>Connecting...</p>}
              connectFailed={<p>Connection Failed.</p>}
              cancellation={(role, reason) => <p>{role} cancelled because of {reason}</p>}
            />
          </div>
          <div style={{ flex: 1 }}>
            <BenchmarkContext.Consumer>
              {context => <p>Pongs received: {context.count}</p>}
            </BenchmarkContext.Consumer>
          </div>
        </div>
      </Benchmark>
    </div>
  );
}

export default App;
