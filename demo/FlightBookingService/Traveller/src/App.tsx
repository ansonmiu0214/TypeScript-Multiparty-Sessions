import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Container, CircularProgress, Grid } from '@material-ui/core/';
import MenuIcon from '@material-ui/icons/Menu';
import { AppState } from './Logic';
import Session from './FlightBooking/Traveller/Traveller';
import Terminal from './components/Terminal';
import ConfirmChoice from './components/ConfirmChoice';
import Alert from '@material-ui/lab/Alert';
import SelectDestination from './components/SelectDestination';
import Waiting from './components/Waiting';

function App() {
  return (
    <div className="App">
      <AppState>
        <AppBar position='sticky'>
          <Toolbar>
            <IconButton edge='start' color='inherit' aria-label='menu'>
              <MenuIcon />
            </IconButton>
            <Typography variant='h6'>
              Flight Booking Service
            </Typography>
          </Toolbar>
        </AppBar>
        <Container style={{ marginTop: '20px' }}>
          <Grid container>
            <Grid item xs={12}>
              <Session
                endpoint='ws://localhost:8080'
                states={{
                  S6: SelectDestination,
                  S7: Terminal,
                  S8: Waiting,
                  S9: ConfirmChoice,
                }}
                waiting={<div>
                  <Typography variant='h5'>Connecting To Server</Typography>
                  <CircularProgress />
                </div>}
                connectFailed={<Alert severity='error'>Connection Failed</Alert>}
                cancellation={(role, reason) => {
                  console.error(role, reason);
                  return <Alert severity='error'>Session Cancelled</Alert>;
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </AppState>
    </div>
  );
}

export default App;
