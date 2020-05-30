import React from 'react';
import BenchmarkContext from './Benchmark';

type Props = {
  endpoint: string
};

type State = {
  ws?: WebSocket,
  button: React.RefObject<HTMLButtonElement>,
  count: number
}

export default class Client extends React.Component<Props, State> {

  static contextType = BenchmarkContext;
  declare context: React.ContextType<typeof BenchmarkContext>

  constructor(props: Props) {
    super(props);
    this.state = {
      ws: undefined,
      button: React.createRef(),
      count: 0,
    }
  }

  componentDidMount() {
    const ws = new WebSocket(this.props.endpoint);

    ws.onopen = () => {
      this.state.button?.current?.click()
    }

    ws.onmessage = ({ data }) => {
      const { label, payload } = JSON.parse(data);
      if (label === 'PONG') {
        this.state.button?.current?.click()
        this.context.setCount(payload[0] as number);
      } else if (label === 'BYE') {
        this.context.setCount(payload[0] as number);
        ws.close();
      } else {
        throw new Error(`Unrecognised label: ${label}`);
      }
    }

    this.setState({
      ws,
      count: this.context.count,
    });
  }

  click() {
    this.state.ws?.send(JSON.stringify({
      label: 'PING',
      payload: [this.context.count],
    }))
  }

  render() {
    return (
      <div style={{ display: 'flex'}}>
        <div style={{ flex: 1 }}>
          <button
            ref={this.state.button}
            onClick={this.click.bind(this)}
            >Ping</button>  
        </div>
        <div style={{ flex: 1 }}>
          Pongs received: {this.context.count}
        </div>
      </div>
    );
  }
}