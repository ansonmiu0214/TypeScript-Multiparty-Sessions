import React from 'react';
import logo from './logo.svg';
import './App.css';
import B from './B/B';
import ReceiveServer from './components/ReceiveServer';
import ReceiveOther from './components/ReceiveOther';
import Decide from './components/Decide';
import ReceiveConfirmation from './components/ReceiveConfirmation';
import TransactionComplete from './components/TransactionComplete';

function App() {
  return (
    <div className="App">
      <h1>Buyer B</h1>
      <B
        endpoint='ws://localhost:8080'
        waiting={<p>Connecting to session...</p>}
        states={{
          S16: ReceiveServer,
          S18: ReceiveOther,
          S19: Decide,
          S20: ReceiveConfirmation,
          S17: TransactionComplete,
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
