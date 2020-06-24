import React from 'react';
import './App.css';
import Alice from './Alice/Alice';
import SendBid from './components/SendBid';
import Done from './components/Done';
import Wait from './components/Wait';

function App() {
  return (
    <div className="App">
      <Alice
        endpoint='ws://localhost:8080'
        waiting={<p>Connecting...</p>}
        states={{
          S18: SendBid,
          S19: Done,
          S20: Wait,
        }}
      />
    </div>
  );
}

export default App;
