import React from 'react';
import S26 from './../Bob/S26';

type S = {
  bid1: number,
  bid2: number,
}

export default class SendBids extends S26<{}, S> {

  state = {
    bid1: 0,
    bid2: 0
  }

  render() {

    const Bid = this.TwoBids('onClick', event => {
      return [this.state.bid1, this.state.bid2]
    })

    return (
      <div>
        <h1>Enter TWO bids</h1>

        <input 
          value={this.state.bid1}
          onChange={ev => this.setState({ bid1: Number(ev.target.value) })}
        />

        <input 
          value={this.state.bid2}
          onChange={ev => this.setState({ bid2: Number(ev.target.value) })}
        />

        <Bid>
          <button>Submit</button>
        </Bid>

      </div>
    )

  }

}