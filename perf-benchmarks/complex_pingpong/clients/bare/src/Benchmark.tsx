import React from 'react';

type ContextProps = {
  count: number,
  setCount: (count: number, cb?: () => void) => void,
}

const Context = React.createContext<ContextProps>({
  count: 0,
  setCount: () => {},
});

type State = {
  count: number,
};

export default Context;
export class Benchmark extends React.Component<{}, State> {

  state = {
    count: 0,
  }

  setCount = (count: number, cb?: () => void) => this.setState({ count }, cb);

  render() {
    return (
      <Context.Provider value={{
        count: this.state.count,
        setCount: this.setCount.bind(this),
      }}>
        {this.props.children}
      </Context.Provider>
    );
  }
}
