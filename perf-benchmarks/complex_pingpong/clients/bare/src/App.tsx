import React from 'react';
import './App.css';

import Client from './Client';
import BenchmarkContext, { Benchmark } from './Benchmark';

function App() {
  return (
    <div className="App">
      <Benchmark>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <Client endpoint='ws://localhost:8080' />
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
