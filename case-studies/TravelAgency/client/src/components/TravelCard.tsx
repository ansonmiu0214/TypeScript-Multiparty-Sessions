import React from "react";
import { Constructor } from "../TravelAgency/A/Types";
import { Card, CardActionArea, CardMedia, CardContent, Typography, Button, CardActions, Grid } from "@material-ui/core";

export interface DestinationOption {
  name: string,
  buildClickComponent?: () => [string, Constructor<React.Component>],
};

export function TravelCard(props: { content: DestinationOption }) {
  const { content } = props;
  
  const IfActive = (buildWrapper: () => [string, Constructor<React.Component>]) => {
    const [label, Wrapper] = buildWrapper();
    return (
      <Wrapper>
        <Button size='small' color='primary'>
          {label}
        </Button>
      </Wrapper>
    );
  }

  const IfInactive = () => {
    return <Button disabled size='small' color='primary'>
      Unavailable
    </Button>;
  }

  return (
    <Card>
      <CardActionArea>
        <CardMedia
          image={`/images/${content.name}.png`}
          title={content.name}
          style={{
            height: 140,
          }}
          />
        <CardContent>
          <Typography gutterBottom variant='h5' component='h2'>
            {content.name}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {content.buildClickComponent !== undefined ?
          IfActive(content.buildClickComponent) :
          IfInactive()
        }
      </CardActions>
    </Card>
  );
}

export const places = ['London', 'Edinburgh', 'Tokyo'];