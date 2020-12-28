import React from "react";
import { S13 } from "../../TravelAgency/A";

import { places, DestinationOption, TravelCard } from "../TravelCard";
import CustomerState from "./CustomerState";
import { Typography, Grid, Container } from "@material-ui/core";

export default class MakeQuery extends S13 {

  static contextType = CustomerState;
  declare context: React.ContextType<typeof CustomerState>;

  render() {
    const options: DestinationOption[] = places.map((name) => {
      if (name === this.context.suggestion) {
        return {
          name, 
          buildClickComponent: () => ([
            'Query',
            this.Query('onClick', () => {
              this.context.setErrorMessage(undefined);
              return [name]; 
            }),
          ]),
        }
      } else {
        return { name }
      }
    });

    return (
      <div>
        <Typography variant='h3' gutterBottom>Suggestion Received</Typography>

        <Container>
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