import React from 'react';
import S5 from "../A/S5"

type S = {
  title: string
}

export default class SendTitle extends S5<{}, S> {

  state = {
    title: '',
  };

  render() {

    const SendTitle = this.title('onClick', (event) => {
      return [this.state.title];
    });

    return (
      <div>
        <input
          type='string'
          onChange={(event) => {
            this.setState({ title: event.target.value });
          }}
          value={this.state.title}
          placeholder='Title to sell'
          />
        <SendTitle>
        <button>
          Request quote
        </button>
        </SendTitle>
      </div>

    )
  }
}