import React from "react";
import { P2 } from "../Game/P2";
import Endgame from "./P2/EndGame";
import WaitOpponent from "./P2/WaitOpponent";
import MakeMove from "./P2/MakeMove";
import WaitServer from "./P2/WaitServer";
import { CircularProgress, Typography, Container } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Peers } from "../Game/P2/Roles";

export default class Player2 extends React.Component {
  render() {
    const origin =  process.env.REACT_APP_PROXY ?? window.location.origin;
    const endpoint = origin.replace(/^http/, 'ws');

    return (
      <P2
        endpoint={endpoint}
        states={{
          S42: WaitOpponent,
          S43: Endgame,
          S44: MakeMove,
          S45: WaitServer,
        }}
        waiting={
          <div>
            <CircularProgress />
            <Typography variant='h6'>Waiting for NOUGHTS</Typography>
          </div>
        }
        connectFailed={
          <Container>
            <Alert severity='error'>Cannot Connect</Alert>
          </Container>
        }
        cancellation={(role, reason) => {
          if (role === Peers.P1) {
            return (
              <Container>
                <Alert severity='info'>{role} forfeited match -- you win!</Alert>
              </Container>
            );
          } else {
            return (
              <Container>
                <Alert severity='error'>{role} cancelled session: {reason}</Alert>
              </Container>
            );  
          }
        }}
      />
    );
  }
}