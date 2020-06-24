import React from 'react';

import './App.css';

import Client from './CompactCalculator/Client/Client';
import SelectOperation from './components/SelectOperation';
import TerminalState from './components/TerminalState';
import ReceiveRes from './components/ReceiveRes';
import ReceiveTerminate from './components/ReceiveTerminate';
import Logic from './Logic';

function App() {

    const [res, setRes] = React.useState(0);

    const context = React.createContext({
        res, setRes
    });

    return (
        <div className="App">
            <Logic>
                <Client
                    endpoint='ws://localhost:8080'
                    waiting={<p>Waiting...</p>}
                    states={{
                        S61: SelectOperation,
                        S62: TerminalState,
                        S63: ReceiveRes,
                        S64: ReceiveRes,
                        S65: ReceiveRes,
                        S66: ReceiveTerminate,
                    }}
                    connectFailed={<div>Connection failed</div>}
                    cancellation={(role, reason) => (
                        <div>Cancellation by {role}: {reason}</div>
                    )}
                />
            </Logic>
    </div>
  );
}

export default App;
