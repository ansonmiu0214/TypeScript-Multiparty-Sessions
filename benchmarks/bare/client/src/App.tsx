import React from 'react';
import './App.css';

import Client from './Client';
import { Benchmark } from './Benchmark';

function App() {
  return (
    <div className="App">
      <Benchmark>
        <Client endpoint='ws://localhost:8080' />
      </Benchmark>
    </div>
  );
}

export default App;
