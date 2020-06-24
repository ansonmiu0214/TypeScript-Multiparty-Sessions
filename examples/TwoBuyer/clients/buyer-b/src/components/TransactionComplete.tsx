import React from 'react';
import S17 from "../B/S17";

export default class TransactionComplete extends S17 {
  render() {
    const date = localStorage.getItem('date');
    localStorage.clear();
    if (date) {
      return (
        <div>
          <h3>Confirmed!</h3>
          <p>Arrives on {date}</p>
        </div>
      )
    } else {
      return (
        <div>Transaction aborted</div>
      )
    }
  }
}