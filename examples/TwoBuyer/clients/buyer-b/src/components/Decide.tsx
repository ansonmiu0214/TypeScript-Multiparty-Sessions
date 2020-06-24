import React from 'react';
import S19 from "../B/S19";

type S = {
  address: string
}

export default class Decide extends S19<{}, S> {

  state = {
    address: '',
  }

  render() {
    const { quote: serverQuote } = JSON.parse(localStorage.getItem('server')!);
    const { quote: otherQuote } = JSON.parse(localStorage.getItem('other')!);

    const BuyFromServer = this.ok('onClick', (event) => {
      return [this.state.address];
    });

    const RejectServer = this.quit('onClick', (event) => {
      return [];
    });

    return (
      <div>
        <h2>Decide</h2>
        <div>Server quoted: ${serverQuote}</div>
        <div>Other buyer quoted: ${otherQuote}</div>

        <div>
          <h4>Buy from server</h4>
          <input
            onChange={(ev) => this.setState({ address: ev.target.value })}
            value={this.state.address}
            placeholder='Address'
          />
          <BuyFromServer>
            <button>Buy</button>
          </BuyFromServer>
        </div>
        <div>
          <h4>Reject</h4>
          <RejectServer>
            <button>Reject</button>
          </RejectServer>
        </div>
      </div>
    )
  }

}