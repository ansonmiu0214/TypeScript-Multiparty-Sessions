import {
  Location,
  Config,
  CellState,
  LocationID,
  getCoordinateID,
  GameBoard,
  GamePlayers,
  GameID,
  coordinatesPerShip,
  initialiseBoard,
  MoveResult,
  GameLogic,
} from "./Models";


interface PlayerState {
  aliveShips: LocationID[][],
  board: GameBoard,
};

type GameState = {
  [Player in GamePlayers]: PlayerState;
};

const GameStore = new Map<GameID, GameState>();

function cpu(player: GamePlayers) {
  return player === GamePlayers.P1 ? GamePlayers.P2 : GamePlayers.P1;
}

function initialiseGame(gameId: GameID, configP1: Config, configP2: Config) {
  // Initialise P1
  const shipsP1 = coordinatesPerShip(configP1);
  const boardP1 = initialiseBoard(shipsP1);
  const stateP1 = {
    aliveShips: shipsP1,
    board: boardP1,
  };

  // Initialise P2
  const shipsP2 = coordinatesPerShip(configP2);
  const boardP2 = initialiseBoard(shipsP2);
  const stateP2 = {
    aliveShips: shipsP2,
    board: boardP2,
  };

  GameStore.set(gameId, {
    [GamePlayers.P1]: stateP1,
    [GamePlayers.P2]: stateP2,
  });

  return Promise.resolve();
}

function deleteGame(gameId: GameID) {
  GameStore.delete(gameId);
  return Promise.resolve();
}

function attack(gameId: GameID, player: GamePlayers, location: Location): Promise<MoveResult> {
  const game = GameStore.get(gameId)!;
  const otherPlayer = game[cpu(player)];

  if (otherPlayer.board.get(getCoordinateID(location))! === CellState.Empty) {
    return Promise.resolve(MoveResult.Miss);
  }

  otherPlayer.board.set(getCoordinateID(location), CellState.Hit);
  const aliveBefore = otherPlayer.aliveShips;
  const aliveAfter = otherPlayer.aliveShips.filter(ship => (
    ship.some(cell => otherPlayer.board.get(cell)! === CellState.Ship)
  ));

  otherPlayer.aliveShips = aliveAfter;

  if (aliveBefore.length === aliveAfter.length) {
    return Promise.resolve(MoveResult.Hit);
  } else if (aliveAfter.length === 0) {
    return Promise.resolve(MoveResult.Win);
  } else {
    return Promise.resolve(MoveResult.Sunk);
  }
}

const statefulGameLogic: GameLogic = {
  initialiseGame,
  deleteGame,
  attack,
};

export default statefulGameLogic;