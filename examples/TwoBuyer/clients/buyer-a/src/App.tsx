import React from 'react';
import logo from './logo.svg';
import './App.css';
import A from './A/A';
import SendTitle from './components/SendTitle';
import ReceiveQuote from './components/ReceiveQuote';
import TerminalState from './components/TerminalState';
import SendQuote from './components/SendQuote';

function App() {
  return (
    <div className="App">
      <h1>Buyer A</h1>
      <A
        endpoint='ws://localhost:8080'
        waiting={<p>Connecting to TwoBuyer session...</p>}
        states={{
          S5: SendTitle,
          S7: ReceiveQuote,
          S8: SendQuote,
          S6: TerminalState,
        }}
        connectFailed={<p>Connection Failed</p>}
        cancellation={(role, reason) => (
          <div>
            <strong>{role}</strong> cancelled: {reason}
          </div>
        )}
      />
    </div>
  );
}

export default App;
