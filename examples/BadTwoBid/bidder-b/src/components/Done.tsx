import React from 'react';
import S27 from "../Bob/S27";

export default class Done extends S27 {

  render() {
    const result = sessionStorage.getItem('result') as string;
    return (
      <div>
        <h1>{result}</h1>
      </div>
    )
  }

}