// ================
// Game Information
// ================

export type GameID = string;

export enum MoveResult {
  Win = "Win",
  Hit = "Hit",
  Sunk = "Sunk",
  Miss = "Miss",
};

export enum GamePlayers {
  P1, P2,
};

// ==========
// Game Board
// ==========

export enum CellState {
  Empty = "Empty",
  Ship = "Ship",
  Hit = "Hit",
  Miss = "Miss",
};

export const BOARD_SIZE = 10;

export type GameBoard = Map<LocationID, CellState>;

export function initialiseBoard(shipCoordinates: number[][]) {
  const setOfCoordinates = new Set(shipCoordinates.reduce((acc, curr) => ([...acc, ...curr]), []));
  const board: GameBoard = new Map();
  for (let x = 0; x < BOARD_SIZE; ++x) {
    for (let y = 0; y < BOARD_SIZE; ++y) {
      const id = getCoordinateID({ x, y });
      board.set(id, setOfCoordinates.has(id) ? CellState.Ship : CellState.Empty);
    }
  }

  return board;
}

// =================
// Board Coordinates
// =================

export interface Location {
  x: number;
  y: number;
};

export type LocationID = number;

export function getCoordinateID({ x, y }: Location) {
  return x * BOARD_SIZE + y;
}

// =====
// Ships
// =====

type Ship = [Location, Location];

export type Config = Ship[];

export function coordinatesPerShip(config: Config) {
  return config.map(([{ x: startX, y: startY }, { x: endX, y: endY }]) => {
    const coordinates: number[] = [];
    if (startX === endX) {
      // Vertical
      for (let y = Math.min(startY, endY); y <= Math.max(startY, endY); ++y) {
        coordinates.push(getCoordinateID({ x: startX, y }));
      }
    } else {
      // Horizontal
      for (let x = Math.min(startX, endX); x <= Math.max(startX, endX); ++x) {
        coordinates.push(getCoordinateID({ x, y: startY }));
      }
    }
    return coordinates;
  });
}

// ===============
// Game Logic APIs
// ===============

export interface GameLogic {
  initialiseGame(gameId: GameID, configP1: Config, configP2: Config): void;
  deleteGame(gameId: GameID): void;
  attack(gameId: GameID, player: GamePlayers, location: Location): MoveResult;
}