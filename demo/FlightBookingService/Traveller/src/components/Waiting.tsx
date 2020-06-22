import React from 'react';
import S8 from '../FlightBooking/Traveller/S8';

import LogicContext from '../Logic';
import { Typography, Divider, CircularProgress } from '@material-ui/core';

export default class Waiting extends S8 {

  static contextType = LogicContext;
  declare context: React.ContextType<typeof LogicContext>;
  
  Available(price: number) {
    console.log('OK!');
    this.context.setPrice(price);
  }

  Full() {
    console.log('Full!');
    this.context.setError(`No availability for flights to ${this.context.destination}`);
    this.context.setDestination('');
  }

  render() {
    return <div>
      <Typography variant='h2'>
        Enquiring availability to {this.context.destination}...
      </Typography>
      <Divider />
      <CircularProgress  />
    </div>;
  }

}