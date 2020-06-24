import React from 'react';
import S20 from "../Alice/S20";

export default class Wait extends S20 {

  Win() {
    sessionStorage.setItem('result', 'Win');
  }

  Lose() {
    sessionStorage.setItem('result', 'Lose');
  }

  render() {
    return <div><h2>Waiting...</h2></div>
  }

}