import React from 'react';
import S20 from "../B/S20";

export default class ReceiveConfirmation extends S20 {

  date(date: string) {
    localStorage.setItem('date', date);
  }

  render() {
    return <div>Waiting for confirmation...</div>
  }

}