import React from "react";
import { B } from "../../TravelAgency/B";
import MakeSuggestion from "./MakeSuggestion";
import Completion from "./Completion";
import MakeDecision from "./MakeDecision";
import WaitResponse from "./WaitResponse";
import { CircularProgress } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { FriendState } from "./FriendState";

export default class FriendView extends React.Component {

  render() {
    const origin =  process.env.REACT_APP_PROXY ?? window.location.origin;
    const endpoint = origin.replace(/^http/, 'ws');
    return (
      <div>
      <FriendState>
        <B
          endpoint={endpoint}
          states={{
            S27: MakeSuggestion,
            S28: Completion,
            S29: WaitResponse,
            S30: MakeDecision,
          }}
          waiting={
            <CircularProgress />
          }
          connectFailed={
            <Alert severity='error'>Connect Failed</Alert>
          }
          cancellation={(role, reason) => {
            console.error(reason);
          return <Alert severity='error'>Session Cancelled by {role}: {reason}</Alert>;
          }}
        />
      </FriendState>
      </div>
    );
  }
};