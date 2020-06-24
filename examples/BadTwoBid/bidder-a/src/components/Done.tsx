import React from 'react';
import S19 from "../Alice/S19";

export default class Done extends S19 {

  render() {
    const result = sessionStorage.getItem('result') as string;
    return (
      <div>
        <h1>{result}</h1>
      </div>
    )
  }

}