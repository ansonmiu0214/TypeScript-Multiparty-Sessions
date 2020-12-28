import React from "react";
import { S19 } from "../../TravelAgency/A";
import CustomerState from "./CustomerState";

import { Typography, CircularProgress } from "@material-ui/core";

export default class SendFull extends S19 {

  static contextType = CustomerState;
  declare context: React.ContextType<typeof CustomerState>;
  
  button: React.RefObject<HTMLButtonElement> = React.createRef();

  componentDidMount() {
    this.button.current?.click();
  }

  render() {
    const Full = this.Full('onClick', () => []);

    return (
      <div>
      <div>
      <Typography variant='h3' gutterBottom>
        Pending enquiry for {this.context.suggestion}
      </Typography>
      </div>
      <div>
      <CircularProgress />
      <Full>
        <button ref={this.button} style={{ display: 'none' }} />
      </Full>
      </div>
    </div>
    );
  }
}