import React from 'react';

type ContextProps = {
  destination: string,
  price: number,
  setDestination: (destination: string) => void,
  setPrice: (price: number) => void,
  error?: string,
  setError: (error: string) => void,
};

const Context = React.createContext<ContextProps>({
  destination: '',
  price: 0,
  setDestination: () => {},
  setPrice: () => {},
  error: undefined,
  setError: () => {}
});

export default Context;

export class AppState extends React.Component<{}, {
  destination: string,
  price: number,
  error?: string,
}> {
  static contextType = Context;
  declare context: React.ContextType<typeof Context>;

  state = {
    destination: '',
    price: 0,
    error: undefined,
  }

  render() {
    const { destination, price, error } = this.state;
    return <Context.Provider value={{
      destination,
      price,
      error,
      setDestination: (destination) => this.setState({ destination }),
      setPrice: (price) => this.setState({ price }),
      setError: (error) => {
        console.log('setting', error);
        this.setState({ error });
      }
      }}>
      {this.props.children}
    </Context.Provider>
  }
}