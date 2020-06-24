import React from 'react';
import S6 from "../A/S6"

export default class TerminalState extends S6 {
  render() {
    localStorage.clear();
    return <div>Transaction Done!</div>
  }
}