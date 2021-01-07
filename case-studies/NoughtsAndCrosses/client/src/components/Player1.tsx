import React from "react";
import { P1 } from "../Game/P1";
import MakeMove from "./P1/MakeMove";
import Endgame from "./P1/EndGame";
import WaitOpponent from "./P1/WaitOpponent";
import WaitServer from "./P1/WaitServer";

import { CircularProgress, Typography, Container } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Peers } from "../Game/P1/Roles";

export default class Player1 extends React.Component {
  render() {
    const origin =  process.env.REACT_APP_PROXY ?? window.location.origin;
    const endpoint = origin.replace(/^http/, 'ws');
    return (
      <P1
        endpoint={endpoint}
        states={{
          S31: MakeMove,
          S32: Endgame,
          S33: WaitServer,
          S34: WaitOpponent,
        }}
        waiting={
          <div>
            <CircularProgress />
            <Typography variant='h6'>Waiting for CROSSES</Typography>
          </div>
        }
        connectFailed={
          <Container>
            <Alert severity='error'>Cannot Connect</Alert>   
          </Container>
        }
        cancellation={(role, reason) => {
          if (role === Peers.P2) {
            return <Container>
              <Alert severity='info'>{role} forfeited match -- you win!</Alert>
            </Container>;
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