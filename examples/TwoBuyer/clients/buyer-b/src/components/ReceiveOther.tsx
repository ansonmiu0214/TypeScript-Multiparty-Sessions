import React from 'react';
import S18 from "../B/S18";

export default class ReceiveOther extends S18 {

  quoteByTwo(other: number) {
    localStorage.setItem('other', JSON.stringify({ quote: other }));
  }

  render() {
    return <div>Waiting for other buyers quote...</div>
  }

}