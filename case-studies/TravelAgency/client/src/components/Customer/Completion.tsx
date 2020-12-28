import React from "react";
import { S12 } from "../../TravelAgency/A";
import CustomerState from "./CustomerState";
import { Alert } from "@material-ui/lab";

export default class Completion extends S12 {

  static contextType = CustomerState;
  declare context: React.ContextType<typeof CustomerState>;
  
  render() {
    if (this.context.friendSplit !== undefined) {
      return (
        <Alert severity='success'>Booking Complete!</Alert>
      );
    } else {
      return (
        <Alert severity='error'>Unsuccessful</Alert>
      );
    }
  }

};