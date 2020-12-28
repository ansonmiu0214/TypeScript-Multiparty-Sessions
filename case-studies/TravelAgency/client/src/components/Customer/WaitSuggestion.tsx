import React from "react";
import { S11 } from "../../TravelAgency/A";

import { places, DestinationOption, TravelCard } from "../TravelCard";
import { Typography, Grid, Container } from "@material-ui/core";

import CustomerState from "./CustomerState";
import { Alert } from "@material-ui/lab";

export default class WaitSuggestion extends S11 {

  static contextType = CustomerState;
  declare context: React.ContextType<typeof CustomerState>;

  Suggest(place: string) {
    this.context.setSuggestion(place);
  }

  render() {
    const options: DestinationOption[] = places.map((name) => ({
      name,
    }));

    return (
      <div>
        <Typography variant='h3' gutterBottom>Pending Suggestion</Typography>


        <Container>
        {this.context.errorMessage !== undefined &&
          <Alert severity='error' style={{
            marginBottom: '1rem',
          }}>{this.context.errorMessage}</Alert>}
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