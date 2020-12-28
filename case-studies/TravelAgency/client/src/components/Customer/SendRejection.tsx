import React from "react";
import { S18 } from "../../TravelAgency/A";
import { Typography, CircularProgress } from "@material-ui/core";

export default class SendRejection extends S18 {

  button: React.RefObject<HTMLButtonElement> = React.createRef();

  componentDidMount() {
    this.button.current?.click();
  }

  render() {
    const Reject = this.Reject('onClick', () => []);
    return (
      <div>
      <div>
      <Typography variant='h3' gutterBottom>
        Waiting for Friend's response
      </Typography>
      </div>
      <div>
      <CircularProgress />
      <Reject>
        <button ref={this.button} style={{ display: 'none' }} />
      </Reject>
      </div>
      </div>
    );
  }
};