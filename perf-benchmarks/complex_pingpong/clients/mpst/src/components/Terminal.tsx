import React from 'react';
import { S6 } from '../PingPong/Client';

export default class Terminal extends S6 {

  render() {
    return (
      <div>
        <button>Ping</button>
        <p>All pongs received</p>
      </div>
    )
  }
  
}