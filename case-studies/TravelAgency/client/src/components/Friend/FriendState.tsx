import React from "react";

type Context = {
  errorMessage?: string,
  setErrorMessage: (errorMessage?: string) => void,

  destination?: string,
  setDestination: (destination?: string) => void,

  quote?: number,
  setQuote: (quote: number) => void,

  going: boolean,
  setGoing: (going: boolean) => void,
};

const Context = React.createContext<Context>({
  errorMessage: undefined,
  setErrorMessage: () => {},

  destination: undefined,
  setDestination: () => {},

  quote: undefined,
  setQuote: () => {},

  going: false,
  setGoing: () => {},
});

export default Context;

type State = {
  errorMessage?: string,
  destination?: string,
  quote?: number,
  going: boolean,
};

export class FriendState extends React.Component<{}, State> {

  constructor(props: {}) {
    super(props);
    this.state = {
      errorMessage: undefined,
      destination: undefined,
      quote: undefined,
      going: false,
    }
   
    this.makeSetter = this.makeSetter.bind(this);
  }

  makeSetter<K extends keyof State>(name: K) {
    return (value: State[K]) => this.setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }

  render() {
    const {
      errorMessage,
      destination,
      quote,
      going,
    } = this.state;

    return <Context.Provider value={{
      errorMessage,
      setErrorMessage: this.makeSetter('errorMessage'),
      destination,
      setDestination: this.makeSetter('destination'),
      quote,
      setQuote: this.makeSetter('quote'),
      going,
      setGoing: this.makeSetter('going'),
    }}>
      {this.props.children}
    </Context.Provider>
  }

}