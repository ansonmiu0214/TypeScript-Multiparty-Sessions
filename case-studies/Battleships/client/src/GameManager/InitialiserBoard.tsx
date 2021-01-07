import React from "react";

import GameState from "./GameState";
import { BOARD_SIZE, getCoordinateID, Location, Config, CellState, GameBoard } from "../Models";
import { Constructor } from "../Battleships/P1/Types";
import { start } from "repl";

interface BoatClass {
  description: string;
  name: 'carrier'| 'battleShip'| 'destroyer'| 'submarine'| 'patrolBoat';
  size: 5 | 4 | 3 | 2;
};

const Carrier: BoatClass = { description: 'Carrier', name: 'carrier', size: 5, };
const Battleship: BoatClass = { description: 'Battleship', name: 'battleShip', size: 4, };
const Destroyer: BoatClass = { description: 'Destroyer', name: 'destroyer', size: 3, };
const Submarine: BoatClass = { description: 'Submarine', name: 'submarine', size: 3, };
const PatrolBoat: BoatClass = { description: 'Patrol Boat', name: 'patrolBoat', size: 2, };

const Boats = [
  Carrier,
  Battleship,
  Destroyer,
  Submarine,
  PatrolBoat,
];

type Props = {
  makeSubmitConfigButton: (config: Config) => Constructor<React.Component>,
};

type ViewOnly = { type: 'view', };
type Editable = { type: 'edit', boat: BoatClass, start?: Location, };

type Mode = 
  | ViewOnly
  | Editable
  ;

type InitConfig = {
  carrier?: [Location, Location],
  battleShip?: [Location, Location],
  destroyer?: [Location, Location],
  submarine?: [Location, Location],
  patrolBoat?: [Location, Location],
};

type State = InitConfig & {
  mode: Mode,
};

export default class InitialiserBoard extends React.Component<Props, State> {

  static contextType = GameState;
  declare context: React.ContextType<typeof GameState>;

  state: State = {
    carrier: undefined,
    battleShip: undefined,
    destroyer: undefined,
    submarine: undefined,
    patrolBoat: undefined,
    mode: { type: 'view' },
  };

  selectStart = (boat: BoatClass, location: Location) => (ev: React.MouseEvent) => {
    this.context.updateMyBoard([ [location, CellState.Ship] ]);
    this.setState({
      mode: { type: 'edit', boat, start: location },
    });
  };

  selectEnd = (boat: BoatClass, start: Location, end: Location) => (ev: React.MouseEvent) => {
    const { x: startX, y: startY } = start;
    const { x: endX, y: endY } = end;

    const shipCoords: [Location, CellState.Ship][] = [];
    for (let x = Math.min(startX, endX); x <= Math.max(startX, endX); ++x) {
      for (let y = Math.min(startY, endY); y <= Math.max(startY, endY); ++y) {
        shipCoords.push([{ x, y }, CellState.Ship]);
      }
    }

    this.context.updateMyBoard(shipCoords);

    const update: InitConfig = { [boat.name]: [start, end] };
    this.setState({
      mode: { type: 'view' },
      ...update,
    });
  };

  checkNeighbours(
    { startCoordinate, size  }: { startCoordinate: Location, size: number }
  ) {
    const neighbours: Location[][] = [];

    // Left
    if (startCoordinate.y - size + 1 >= 0) {
      const possibleShip: Location[] = [];
      for (let y = startCoordinate.y - size + 1; y <= startCoordinate.y; ++y) {
        possibleShip.push({ x: startCoordinate.x, y });
      }
      neighbours.push(possibleShip);
    }

    // Right
    if (startCoordinate.y + size - 1 < BOARD_SIZE) {
      const possibleShip: Location[] = [];
      for (let y = startCoordinate.y; y <= startCoordinate.y + size - 1; ++y) {
        possibleShip.push({ x: startCoordinate.x, y });
      }
      neighbours.push(possibleShip);
    }

    // Up
    if (startCoordinate.x - size + 1 >= 0) {
      const possibleShip: Location[] = [];
      for (let x = startCoordinate.x - size + 1; x <= startCoordinate.x; ++x) {
        possibleShip.push({ x, y: startCoordinate.y });
      }
      neighbours.push(possibleShip);
    }
    
    // Down
    if (startCoordinate.x + size - 1 < BOARD_SIZE) {
      const possibleShip: Location[] = [];
      for (let x = startCoordinate.x; x <= startCoordinate.x + size - 1; ++x) {
        possibleShip.push({ x, y: startCoordinate.y });
      }
      neighbours.push(possibleShip);
    }

    return neighbours;
  }

  render() {
    const {
      carrier,
      battleShip,
      destroyer,
      submarine,
      patrolBoat,
      mode,
    } = this.state;

    const board = this.context.myBoard;

    const viewOnlyBoard = (mode: ViewOnly) => (
      Array.from({ length: BOARD_SIZE }).map((_, x) => (
        <tr key={x}>
          {Array.from({ length: BOARD_SIZE }).map((_, y) => {
            const locationID = getCoordinateID({ x, y });
            const cell = board.get(locationID)!;
            return <td key={locationID} className={cell} />
          })}
        </tr>
      ))
    );

    const editBoard = (mode: Editable) => {
      const { boat, start } = mode;
      return Array.from({ length: BOARD_SIZE }).map((_, x) => (
        <tr key={x}>
          {Array.from({ length: BOARD_SIZE }).map((_, y) => {
            const locationID = getCoordinateID({ x, y });
            const cell = board.get(locationID)!;

            if (cell !== CellState.Empty) {
              return <td key={locationID} className={cell} />;
            };

            if (start === undefined) {
              // Check if neighbours are valid
              const possibleShips = this.checkNeighbours({
                startCoordinate: { x, y, },
                size: mode.boat.size,
              });

              if (possibleShips.length === 0) {
                return <td key={locationID} className={cell} />;
              }

              const isPossibleStart = possibleShips.some(possibleShip => (
                possibleShip.every(location => board.get(getCoordinateID(location)) === CellState.Empty)
              ));

              if (isPossibleStart) {
                return <td key={locationID} className={`${cell} active`} onClick={this.selectStart(boat, { x, y })} />;
              } else {
                return <td key={locationID} className={cell} />;
              }

            } else {
              // Check if current cell is valid end state
              if ((start.y === y && Math.abs(start.x - x) === boat.size - 1) ||
                  (start.x === x && Math.abs(start.y - y) === boat.size - 1)) {
                return <td key={locationID} className={`${cell} active`} onClick={this.selectEnd(boat, start, { x, y })} />
              } else {
                return <td key={locationID} className={cell} />;
              }
            }
          })}
        </tr>
      ));
    };

    const RenderSubmitConfig = (config: Config) => {
      const SubmitConfig = this.props.makeSubmitConfigButton(config);
      return (
        <React.Fragment>
          <hr />
          <SubmitConfig>
            <button>Send Config</button>
          </SubmitConfig>
        </React.Fragment>
      );
    };

    return (
      <div>
        <h1>Place Your Ships</h1>          
        <table className='board'>
          <thead></thead>
          <tbody>
          {mode.type === 'view' && viewOnlyBoard(mode)}
          {mode.type === 'edit' && editBoard(mode)}
          </tbody>
        </table>

        <hr />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
            margin: 'auto'
          }}
        >
          {Boats.map((boat, key) => (
            <button
              key={key}
              className={`mode ${this.state[boat.name] !== undefined && 'active'}`}
              style={{ display: 'inline-block' }}
              disabled={mode.type === 'edit' || this.state[boat.name] !== undefined}
              onClick={() => this.setState({ mode: { type: 'edit', boat, start: undefined }})}
            >
              {this.state[boat.name] !== undefined && '✅ '}{boat.description}: length = {boat.size}
            </button>
          ))}
        </div>

        {carrier && battleShip && destroyer && submarine && patrolBoat && 
          RenderSubmitConfig([carrier, battleShip, destroyer, submarine, patrolBoat])}
      </div>
    )
  }

};