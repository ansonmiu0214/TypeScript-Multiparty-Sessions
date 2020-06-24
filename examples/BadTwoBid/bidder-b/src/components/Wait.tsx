import React from 'react';
import S28 from "../Bob/S28";

export default class Wait extends S28 {

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