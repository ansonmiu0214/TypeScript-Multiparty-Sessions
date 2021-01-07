import React from "react";
import { S27 } from "../../TravelAgency/B";

import FriendState from "./FriendState";

import { Typography, Button, CardActions, Grid, Container } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { places, DestinationOption, TravelCard } from "../TravelCard";


export default class MakeSuggestion extends S27 {

  static contextType = FriendState;
  declare context: React.ContextType<typeof FriendState>;
  
  render() {
    const options: DestinationOption[] = places.map((name) => ({
      name,
      buildClickComponent: () => (
        [
          'Suggest',
          this.Suggest('onClick', () => {
            this.context.setDestination(name);
            this.context.setErrorMessage(undefined);
            return [name]
          }),
        ]
      ),
    }));

    return (
      <div>
        <Typography variant='h3' gutterBottom>
          Offer Suggestion
        </Typography>


        <Container>
          {this.context.errorMessage !== undefined &&
            <Alert style={{
              marginBottom: '1rem',
            }} severity='error'>{this.context.errorMessage}</Alert>}

          <Grid container spacing={3}>
            {options.map((option, key) => (
              <Grid item xs={6} sm={4} key={key}>
                <TravelCard content={option} />
              </Grid>
            ))}
          </Grid>
        </Container>

      </div>
    );
  }

};