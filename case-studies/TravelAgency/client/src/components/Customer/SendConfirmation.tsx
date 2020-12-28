import React from "react";
import { S17 } from "../../TravelAgency/A";
import CustomerState from "./CustomerState";

import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, DialogContentText } from "@material-ui/core";

export default class SendConfirmation extends S17<{
  name: string,
  creditCard?: number,
}> {

  static contextType = CustomerState;
  declare context: React.ContextType<typeof CustomerState>;

  state = {
    name: '',
    creditCard: undefined,
  };

  render() {
    const { name, creditCard } = this.state;

    const Confirm = this.Confirm('onClick', () => ([{
      name, creditCard: String(creditCard)
    }]));

    return (
      <div>
        <Dialog open={true}>
          <DialogTitle>Friend Accepted!</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Friend will pay <strong>${this.context.friendSplit}</strong> of ${this.context.quote}.
            </DialogContentText>
            <TextField
              label='Name'
              value={name}
              onChange={(ev) => this.setState({ name: ev.target.value })}
              fullWidth
            />
            <TextField
              label='Credit Card'
              value={creditCard}
              onChange={(ev) => this.setState({ creditCard: Number(ev.target.value) })}
              type='number'
            />
          </DialogContent>
          <DialogActions>
            <Confirm>
              <Button color='primary'>Submit</Button>
            </Confirm>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
};