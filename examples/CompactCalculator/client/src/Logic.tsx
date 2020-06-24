import React from "react";

export enum Operand {
  Add = '+',
  Mult = '*',
  Double = 'x2'
};

// =======
// Context
// =======

type ContextProps = {
  digitPressed: (digit: number) => number,
  retrieveValue: () => number,
  storeValue: () => void,
  current: number,
  setCurrent: (_: number) => void,
  operand: Operand,
  setOperand: (_: Operand) => void,
}

export const LogicContext = React.createContext<ContextProps>({
  digitPressed: () => 0,
  retrieveValue: () => 0,
  storeValue: () => {},
  current: 0,
  setCurrent: () => {},
  operand: Operand.Double,
  setOperand: () => {},
});

type State = {
  current: number,
  memory: number[],
  op: Operand,
};

export default class Logic extends React.Component<{}, State> {

  constructor(props: {}) {
    super(props);
    this.state = {
      current: 0,
      memory: [],
      op: Operand.Double,
    };
  }

  render() {

    console.log(JSON.stringify(this.state));

    const digitPressed = (digit: number) => {
      const current = this.state.current * 10 + digit;
      this.setState({ current }, () => console.log('Current updated', current));
      return current;
    };

    const retrieveValue = () => {
      const { memory } = this.state;
      const value = memory[memory.length - 1];
      this.setState({
        memory: memory.filter((_, i) => i < memory.length - 1)
      });
      return value;
    }; 

    const storeValue = () => {
      this.setState(prevState => ({
        ...prevState,
        memory: [...prevState.memory, prevState.current],
        current: 0,
      }));
    };

    const setOperand = (op: Operand) => this.setState({ op }, () => console.log('Op updted', op));

    const setCurrent = (current: number) => this.setState({ current });

    return (
      <LogicContext.Provider value={{
        digitPressed,
        retrieveValue,
        storeValue,
        current: this.state.current,
        setCurrent,
        operand: this.state.op,
        setOperand
      }}>
        {this.props.children}
      </LogicContext.Provider>
    );
  }
}