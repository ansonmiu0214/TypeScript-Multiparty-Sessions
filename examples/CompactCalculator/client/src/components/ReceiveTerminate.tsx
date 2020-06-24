import React from 'react';

import S66 from '../CompactCalculator/Client/S66';

export default class ReceiveTerminate extends S66 {
    render() {
        return <div>Waiting for terminate...</div>
    } 

    Terminate() {
        console.log('Received terminate')
    }

    
}