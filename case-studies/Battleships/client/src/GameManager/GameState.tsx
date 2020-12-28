import React from "react";
import { Location, CellState, GameBoard, initialiseBoard, getCoordinateID, } from "../Models";

export enum GamePlayers {
  ME = 'ME',
  FOE = 'FOE',
};

type ContextProps = {
  myBoard: GameBoard,
  foeBoard: GameBoard,
  updateMyBoard: (updates: [Location, CellState][]) => void,
  updateFoeBoard: (updates: [Location, CellState][]) => void,
  winner?: GamePlayers,
  setWinner: (winner: GamePlayers) => void,
  message: string,
  updateMessage: (message: string) => void,
};

const placeholder = new Map();

const Context = React.createContext<ContextProps>({
  myBoard: placeholder,
  foeBoard: placeholder,
  updateMyBoard: () => {},
  updateFoeBoard: () => {},
  setWinner: () => {},
  message: '',
  updateMessage: () => {},
});

export default Context;

export class GameProvider extends React.Component<{}, {
  myBoard: GameBoard,
  foeBoard: GameBoard,
  winner?: GamePlayers,
  message: string,
}> {

  state = {
    myBoard: initialiseBoard([]),
    foeBoard: initialiseBoard([]),
    winner: undefined,
    message: '',
  };

  private updateBoard = (player: GamePlayers) => (updates: [Location, CellState][]) => {
    const boardName = player === GamePlayers.ME ? 'myBoard' : 'foeBoard';
    this.setState(prevState => {
      const updatedBoard = new Map(Array.from(prevState[boardName]));
      updates.forEach(([coord, newState]) => {
        const coordID = getCoordinateID(coord);
        updatedBoard.set(coordID, newState);
      });
      return {
        ...prevState, [boardName]: updatedBoard
      };
    });
  };

  render() {
    const { myBoard, foeBoard, winner, message, } = this.state;
    return (
      <Context.Provider value={{
        myBoard,
        foeBoard,
        updateMyBoard: this.updateBoard(GamePlayers.ME).bind(this),
        updateFoeBoard: this.updateBoard(GamePlayers.FOE).bind(this),
        winner,
        setWinner: (winner) => this.setState({
          winner,
          message: winner === GamePlayers.ME ? 'You WON!' : 'You LOSE...',
        }),
        message,
        updateMessage: (message) => this.setState({ message }),
      }}>
        {this.props.children}
      </Context.Provider>
    );
  }

};