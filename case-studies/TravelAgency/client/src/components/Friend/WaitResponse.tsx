import React from "react";
import { S29 } from "../../TravelAgency/B";

import FriendState from "./FriendState";
import { Typography, CircularProgress } from "@material-ui/core";

export default class WaitResponse extends S29 {

  static contextType = FriendState;
  declare context: React.ContextType<typeof FriendState>;

  Full() {
    this.context.setErrorMessage(
      `No availability for ${this.context.destination}`
    );
    this.context.setDestination(undefined);
  }

  Quote(quote: number) {
    this.context.setQuote(quote);
  }

  render() {
    return (
      <div>
        <div>
        <Typography variant='h3' gutterBottom>
          Pending enquiry for {this.context.destination}
        </Typography>
        </div>
        <div>
        <CircularProgress />
        </div>
      </div>
    );
  }
  
};