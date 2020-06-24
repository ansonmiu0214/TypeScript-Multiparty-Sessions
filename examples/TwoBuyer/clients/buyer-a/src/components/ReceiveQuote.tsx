import React from 'react';
import S7 from "../A/S7";

export default class ReceiveQuote extends S7 {

  quote(quote: number) {
    localStorage.setItem('quote', JSON.stringify({ quote }));
  }

  render() {
    return <div>Waiting for server quote...</div>
  }

}