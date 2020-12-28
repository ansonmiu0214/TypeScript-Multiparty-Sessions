import React from "react";
import { S28 } from "../../TravelAgency/B";

import FriendState from "./FriendState"
import { Alert } from "@material-ui/lab";

export default class Completion extends S28 {

  static contextType = FriendState;
  declare context: React.ContextType<typeof FriendState>;

  render() {
    if (this.context.going) {
      return <Alert severity='success'>Booking Confirmed</Alert>
    } else {
      return <Alert severity='error'>Unsuccessful</Alert>
    }
  }
};