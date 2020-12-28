import React from 'react';
import { S7 } from '../PingPong/Client';
import BenchmarkContext from '../Benchmark';

export default class Receive extends S7 {

  static contextType = BenchmarkContext;
  declare context: React.ContextType<typeof BenchmarkContext>;
 
  PONG(count: number) {
    this.context.setCount(count);
  }

  BYE(count: number) {
    this.context.setCount(count);
  }

  render() {
    return (
      <button>Ping</button>
    );
  }

}