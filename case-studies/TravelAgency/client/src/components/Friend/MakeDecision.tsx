import React from "react";
import { S30 } from "../../TravelAgency/B";

import FriendState from "./FriendState";
import { Dialog, DialogTitle, DialogContent, TextField, FormControl, InputLabel, Input, InputAdornment, DialogActions, Button } from "@material-ui/core";

export default class MakeDecision extends S30<{
  split: number,
}> {

  static contextType = FriendState;
  declare context: React.ContextType<typeof FriendState>;

  state = {
    split: 0,
  };

  render() {

    const OK = this.OK('onClick', () => {
      this.context.setGoing(true);
      return [this.state.split]
    });
    const NO = this.No('onClick', () => []);

    return (
      <div>
        <Dialog open={true}>
          <DialogTitle>Trip is Available</DialogTitle>
          <DialogContent>
            <TextField
              InputProps={{
                readOnly: true,
              }}
              value={this.context.destination}
              fullWidth
              />
            <FormControl fullWidth>
              <InputLabel>Amount</InputLabel>
              <Input
                readOnly={true}
                value={this.context.quote}
                startAdornment={
                  <InputAdornment position='start'>$</InputAdornment>
                }
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Your Split</InputLabel>
              <Input
                type='number'
                value={this.state.split}
                startAdornment={
                  <InputAdornment position='start'>$</InputAdornment>
                }
                onChange={(ev) => {
                  this.setState({ split: Number(ev.target.value) });
                }}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <NO>
              <Button color='secondary'>No</Button>
            </NO>
            <OK>
              <Button
                color='primary'
                disabled={this.state.split <= 0 || this.state.split > this.context.quote!}
                >OK</Button>
            </OK>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

};