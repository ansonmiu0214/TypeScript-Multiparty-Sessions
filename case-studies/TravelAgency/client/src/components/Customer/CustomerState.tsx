import React from "react";

type Context = {
  suggestion: string,
  setSuggestion: (suggestion: string) => void,
  quote?: number,
  setQuote: (quote: number) => void,
  friendSplit?: number,
  setFriendSplit: (friendSplit: number) => void,
  errorMessage?: string,
  setErrorMessage: (errorMessage?: string) => void,
};

const Context = React.createContext<Context>({
  suggestion: '',
  setSuggestion: () => {},
  quote: undefined,
  setQuote: () => {},
  friendSplit: undefined,
  setFriendSplit: () => {},
  errorMessage: undefined,
  setErrorMessage: () => {},
});

export default Context;

type State = {
  suggestion: string,
  quote?: number,
  friendSplit?: number,
  errorMessage?: string,
}

export class CustomerState extends React.Component<{}, State> {

  constructor(props: {}) {
    super(props);
    this.state = {
      suggestion: '',
      quote: undefined,
      friendSplit: undefined,
      errorMessage: undefined,
    };

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
      suggestion,
      quote,
      friendSplit,
      errorMessage,
    } = this.state;
    return (
      <Context.Provider value={{
        suggestion,
        setSuggestion: this.makeSetter('suggestion'),
        quote,
        setQuote: this.makeSetter('quote'),
        friendSplit,
        setFriendSplit: this.makeSetter('friendSplit'),
        errorMessage,
        setErrorMessage: this.makeSetter('errorMessage'),
      }}>
        {this.props.children}
      </Context.Provider>
    );
  }


}