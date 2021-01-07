import React from "react";
import "./GameBoard.css";

import { CellState, Location, BOARD_SIZE, getCoordinateID, LocationID } from '../Models';
import GameState, { GamePlayers } from "./GameState";
import { Constructor } from "../Battleships/P2/Types";

type Props = {
  player: GamePlayers,
  onSpecific?: { locations: Set<LocationID>, listener: () => void, },
  onEmptyListener?: (location: Location) => void,
  onEmptyWrapper?: (location: Location) => Constructor<React.Component>,
};

export default class GameBoard extends React.Component<Props> {

  static contextType = GameState;
  declare context: React.ContextType<typeof GameState>;


  render() {
    const board = this.props.player === GamePlayers.ME ? this.context.myBoard : this.context.foeBoard;

    return (
      <div>
        <table className={`board ${this.props.player}`}>
          <thead></thead>
          <tbody>
          {Array.from({ length: BOARD_SIZE }).map((_, x) => (
            <tr key={x}>
              {Array.from({ length: BOARD_SIZE }).map((_, y) => {
                const locationID = getCoordinateID({ x, y });
                const cell = board.get(locationID)!;
                const { onEmptyListener, onEmptyWrapper, onSpecific } = this.props;
                
                if (onEmptyListener !== undefined) {
                  if (cell === CellState.Empty) {
                    return <td key={locationID} className={`${cell} active`} onClick={() => onEmptyListener({ x, y })} />;
                  } else {
                    return <td key={locationID} className={cell} />;
                  }
                }

                if (onEmptyWrapper !== undefined) {
                  if (cell === CellState.Empty) {
                    const Wrapper = onEmptyWrapper({ x, y});
                    return <Wrapper><td key={locationID} className={`${cell} active`} /></Wrapper>;
                  } else {
                    return <td key={locationID} className={cell} />;
                  }
                }

                if (onSpecific !== undefined && onSpecific.locations.has(locationID)) {
                  return <td key={locationID} className={cell} onClick={onSpecific.listener}/>;  
                }
                
                return <td key={locationID} className={cell} />;
              })}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    );
  }

};