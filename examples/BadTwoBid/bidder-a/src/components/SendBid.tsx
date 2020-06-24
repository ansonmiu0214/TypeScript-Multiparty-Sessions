import React from 'react';
import S18 from './../Alice/S18';

type S = {
  bid: number
}

export default class SendBid extends S18<{}, S> {

  state = {
    bid: 0
  }

  render() {

    const Bid = this.Bid('onClick', event => {
      return [this.state.bid]
    })

    return (
      <div>
        <h1>Enter ONE bid</h1>

        <input 
          value={this.state.bid}
          onChange={ev => this.setState({ bid: Number(ev.target.value) })}
        />

        <Bid>
          <button>Submit</button>
        </Bid>

      </div>
    )

  }

}