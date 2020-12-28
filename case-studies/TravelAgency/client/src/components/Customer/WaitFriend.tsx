import React from "react";
import { S16 } from "../../TravelAgency/A";
import CustomerState from "./CustomerState";

import { Typography, CircularProgress } from "@material-ui/core";

export default class WaitFriend extends S16 {

  static contextType = CustomerState;
  declare context: React.ContextType<typeof CustomerState>;

  OK(split: number) {
    this.context.setFriendSplit(split);
  }

  No() {
    
  }

  render() {
    return (
      <div>
      <div>
      <Typography variant='h3' gutterBottom>
        Waiting for Friend's response
      </Typography>
      </div>
      <div>
      <CircularProgress />
      </div>
      </div>
    );
  }

};