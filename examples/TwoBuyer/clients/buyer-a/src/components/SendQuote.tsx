import React from 'react';
import S8 from "../A/S8";

type S = {
  quote: number
}

export default class SendQuote extends S8<{}, S> {

  state = {
    quote: 0,
  }

  render() {

    const { quote: quoteFromServer } = JSON.parse(localStorage.getItem('quote')!);

    const SubmitQuote = this.quoteByTwo('onClick', (event) => {
      return [this.state.quote];
    });

    return (
      <div>
        <div>
          Quote from server: ${quoteFromServer}
        </div>
        <div>
          <input
            type='number'
            placeholder='New Quote'
            onChange={(ev) => this.setState({ quote: Number(ev.target.value) }) }
            value={this.state.quote}
            />
          
          <SubmitQuote>
            <button>
              Submit New Quote
            </button>
          </SubmitQuote>

        </div>
      </div>
    )

  }

}