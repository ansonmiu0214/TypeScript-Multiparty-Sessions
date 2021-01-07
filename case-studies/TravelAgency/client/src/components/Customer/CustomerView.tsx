import React from "react";
import { A } from "../../TravelAgency/A";
import { CustomerState } from "./CustomerState";
import { CircularProgress } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Completion from "./Completion";
import WaitSuggestion from "./WaitSuggestion";
import MakeQuery from "./MakeQuery";
import WaitResponse from "./WaitResponse";
import AskFriend from "./AskFriend";
import SendConfirmation from "./SendConfirmation";
import WaitFriend from "./WaitFriend";
import SendRejection from "./SendRejection";
import SendFull from "./SendFull";

export default class CustomerView extends React.Component {

  render() {
    const origin =  process.env.REACT_APP_PROXY ?? window.location.origin;
    const endpoint = origin.replace(/^http/, 'ws');
    return (
      <div>
      <CustomerState>
        <A
          endpoint={endpoint}
          states={{
            S19: SendFull,
            S13: MakeQuery,
            S15: AskFriend,
            S17: SendConfirmation,
            S18: SendRejection,
            S11: WaitSuggestion,
            S14: WaitResponse,
            S16: WaitFriend,
            S12: Completion, 
          }}
          waiting={
            <CircularProgress />
          }
          connectFailed={
            <Alert severity='error'>Connect Failed</Alert>
          }
          cancellation={(role, reason) => {
          return <Alert severity='error'>Session Cancelled by {role}: {reason}</Alert>;
          }}
        />
      </CustomerState>
      </div>
    );
  }
};