import React from 'react';
import S16 from "../B/S16";


export default class ReceiveServer extends S16 {

  quote(server: number) {
    localStorage.setItem('server', JSON.stringify({ quote: server }));
  }

  render() {
    return <div>Waiting for server quote...</div>
  }

}