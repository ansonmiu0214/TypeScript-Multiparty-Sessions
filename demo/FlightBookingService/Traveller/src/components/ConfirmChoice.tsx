import React from 'react';
import S9 from '../FlightBooking/Traveller/S9';
import LogicContext from '../Logic';
import Alert from '@material-ui/lab/Alert';
import { Typography, Grid, Button, TextField, Divider } from '@material-ui/core';

import { Credential as Cred } from '../Payment';

export default class ConfirmChoice extends S9<Cred> {

  static contextType = LogicContext;
  declare context: React.ContextType<typeof LogicContext>;

  state = {
    name: '',
    creditCard: 0,
  }

  render() {
    const Confirm = this.Confirm('onClick', ev => {
      this.context.setPrice(0);
      this.context.setDestination('');
      return [{ name: this.state.name, creditCard: this.state.creditCard }];
    });

    const Reject = this.Reject('onClick', ev => {
      this.context.setPrice(0);
      this.context.setDestination('');
      return [];
    });

    return <div>
      <Alert severity="success">
        Flights to {this.context.destination} available!
      </Alert>
      <Typography variant='h2'>
        Price: GBP {this.context.price}
      </Typography>
      <Divider />

      <Grid container spacing={4} alignItems='center'>
        <Grid item style={{ textAlign: 'center' }}>
          <Typography variant='h4'>Accept</Typography>

          <TextField 
          type="text"
          value={this.state.name}
          onChange={ev => this.setState({ name: ev.target.value })}
          label="Full Name"
          />

          <TextField 
          type="number"
          value={this.state.creditCard}
          onChange={ev => this.setState({ creditCard: Number(ev.target.value) })}
          label="Credit Card Number"
          />

          <div>
            <Confirm>
              <Button color='primary'>Confirm</Button>
            </Confirm>
          </div>
        </Grid>
        <Grid item style={{ textAlign: 'center' }}>
          <Typography variant='h4'>Reject</Typography>

          <div>
            <Reject>
              <Button color='secondary'>Reject</Button>
            </Reject>
          </div>
        </Grid>
      </Grid>

    </div>
  }
}