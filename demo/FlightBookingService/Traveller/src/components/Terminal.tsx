import React from 'react';
import S7 from '../FlightBooking/Traveller/S7';
import { Typography } from '@material-ui/core';

export default class Terminal extends S7 {
  render() {
    return <Typography variant='h2'>
      Thank you for using our service!
    </Typography>;
  }
}