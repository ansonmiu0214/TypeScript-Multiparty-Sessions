import React from 'react';
import { Coordinate as Point } from './GameTypes';

export enum Cell { Empty, P1, P2 };
export enum Result { Win, Lose, Draw, Nothing };

type ContextProps = {
  board: Array<Array<Cell>>,
  winner: Result,
  updateMove: (role: Cell, point: Point) => void,
  setResult: (result: Result) => void,
  myMarker?: Cell,
  setMyMarker: (cell: Cell) => void,
};

const Context = React.createContext<ContextProps>({
  board: [[]],
  winner: Result.Nothing,
  updateMove: () => {},
  setResult: () => {},
  myMarker: undefined,
  setMyMarker: () => {},
});

export default Context;

export class GameState extends React.Component<{}, {
  board: Array<Array<Cell>>,
  winner: Result,
  myMarker?: Cell,
}> {

  state = {
    board: [
      [Cell.Empty, Cell.Empty, Cell.Empty],
      [Cell.Empty, Cell.Empty, Cell.Empty],
      [Cell.Empty, Cell.Empty, Cell.Empty],
    ],
    winner: Result.Nothing,
    myMarker: undefined,
  }

  render() {
    const {
      board, winner, myMarker,
    } = this.state;
    const updateMove = (role: Cell, point: Point) => {
      const board = this.state.board.map((row, x) => (
        row.map((cell, y) => (
          x === point.x && y === point.y ? role : cell
        ))
      ));
      this.setState({ board });
    }

    return <Context.Provider value={{
      board,
      winner,
      updateMove,
      setResult: (winner) => this.setState({ winner }),
      myMarker,
      setMyMarker: (myMarker) => this.setState({ myMarker }),
    }}>
      {this.props.children}
    </Context.Provider>
  }
}