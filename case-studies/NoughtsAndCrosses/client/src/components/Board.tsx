import React from 'react';
import './Board.css';
import Context, { Cell } from '../GameState';
import { Constructor } from '../Game/P1/Types';
import { Coordinate as Point } from '../GameTypes';

const cellsWithVerticalLines = new Set([1, 4, 7]);
const cellsWithHorizontalLines = new Set([3, 4, 5]);

export default class Board extends React.Component<{
  makeMove?: (point: Point) => Constructor<React.Component>
}> {

  static contextType = Context;
  declare context: React.ContextType<typeof Context>;

  render() {
    return (
      <table className='Board'>
        <tbody>
          {this.context.board.map((row, x) => (
            <tr key={x}>
              {row.map((marker, y) => {
                const key = x * this.context.board.length + y;
                const classes: string[] = ['grid-cell'];

                switch (marker) {
                  case Cell.Empty:
                    if (this.props.makeMove !== undefined) {
                      classes.push(
                        this.context.myMarker === Cell.P1 ? 'empty-P1' : 'empty-P2'
                      );
                    }
                    break;
                  case Cell.P1:
                    classes.push('P1'); break;
                  case Cell.P2:
                    classes.push('P2'); break;
                }
                
                if (cellsWithHorizontalLines.has(key)) {
                  classes.push('hori');
                }

                if (cellsWithVerticalLines.has(key)) {
                  classes.push('vert');
                }

                const GridCell = (
                  <td key={key} className={classes.join(' ')}>
                  </td>
                );
                if (marker === Cell.Empty && this.props.makeMove) {
                  const MakeMove = this.props.makeMove({ x, y });
                  return <MakeMove key={key}>{GridCell}</MakeMove>;
                } else {
                  return GridCell;
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

}