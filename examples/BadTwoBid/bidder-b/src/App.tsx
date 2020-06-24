import React from 'react';
import logo from './logo.svg';
import './App.css';
import Bob from './Bob/Bob';
import SendBids from './components/SendBid';
import Done from './components/Done';
import Wait from './components/Wait';

function App() {
  return (
    <div className="App">
      <Bob
        endpoint='ws://localhost:8080'
        waiting={<p>Connecting...</p>}
        states={{
          S26: SendBids,
          S27: Done,
          S28: Wait,
        }}
      />
    </div>
  );
}

export default App;
