import React from "react";
import { S14 } from "../../TravelAgency/A";

import CustomerState from "./CustomerState";
import { Typography, CircularProgress } from "@material-ui/core";

export default class WaitResponse extends S14 {

  static contextType = CustomerState;
  declare context: React.ContextType<typeof CustomerState>;

  Available(quote: number) {
    // console.log('Quote', quote);
    this.context.setQuote(quote);
  }

  Full() {
    this.context.setErrorMessage(`
      No availability for ${this.context.suggestion}
    `);
    this.context.setSuggestion('');
  }

  render() {
    return (
        <div>
        <div>
        <Typography variant='h3' gutterBottom>
          Pending enquiry for {this.context.suggestion}
        </Typography>
        </div>
        <div>
        <CircularProgress />
        </div>
      </div>
    );
  }

};