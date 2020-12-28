import React from "react";
import { S15 } from "../../TravelAgency/A";
import CustomerState from "./CustomerState";

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";

export default class AskFriend extends S15 {

  static contextType = CustomerState;
  declare context: React.ContextType<typeof CustomerState>;

  render() {
    const SendQuote = this.Quote('onClick', () => [this.context.quote!]);
    return (
      <div>
        <Dialog open={true}>
          <DialogTitle>Trip is Available</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Quote from Travel Agency: ${this.context.quote}
            </DialogContentText>
            <DialogActions>
              <SendQuote>
                <Button color='primary'>Ask Friend</Button>
              </SendQuote>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
};