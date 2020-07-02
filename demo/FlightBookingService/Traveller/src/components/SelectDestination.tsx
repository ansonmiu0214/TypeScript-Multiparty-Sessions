import React from 'react';
import S6 from '../FlightBooking/Traveller/S6';
import { Typography, Divider, TextField, Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';

import LogicContext from '../Logic';

export default class SelectDestination extends S6<{
  destination: string
}> {

  static contextType = LogicContext;
  declare context: React.ContextType<typeof LogicContext>;

  state = {
    destination: ''
  };

  render() {

    const London = this.Destination('onClick', ev => {
      this.context.setDestination('London');
      return ['London'];
    });

    const Other = this.Destination('onClick', ev => {
      this.context.setDestination(this.state.destination);
      return [this.state.destination];
    });

    return (<div>
      {this.context.error && 
        <Alert severity="error">{this.context.error}</Alert>
      }
      <Grid container spacing={4} alignItems='center'>
        <Grid item xs={12}>
          <Typography align='center' variant='h2'>
            Select Your Destination
          </Typography>

          <Divider />

          <Card>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image="https://cdn.londonandpartners.com/visit/general-london/areas/river/76709-640x360-houses-of-parliament-and-london-eye-on-thames-from-above-640.jpg"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  London
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Mandatory 14-day quarantine
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <London>
                <Button size="small" color="primary">
                  Enquire
                </Button>
              </London>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={10}>
          <Typography align='center' variant='h4'>
            Not Listed?
          </Typography>

          <div style={{ textAlign: 'center' }}>
            <TextField label="Destination"
              value={this.state.destination}
              onChange={ev => this.setState({ destination: ev.target.value })}
              />
            <div>
              <Other>
                <Button 
                  disabled={this.state.destination.trim().length === 0}
                  color='primary'
                  >Enquire</Button>
              </Other>
            </div>
          </div>

        </Grid>
      </Grid>
    </div>);
  }
}