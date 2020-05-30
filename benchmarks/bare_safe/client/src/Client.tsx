import React from 'react';
import BenchmarkContext from './Benchmark';

type Props = {
  endpoint: string
};

type State = {
  ws?: WebSocket,
  button: React.RefObject<HTMLButtonElement>,
  visible: boolean,
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
      visible: false,
      count: 0,
    }
  }

  componentDidMount() {
    const ws = new WebSocket(this.props.endpoint);

    ws.onopen = () => {
      this.setState({
        visible: true,
      }, () => this.state.button?.current?.click());
    }

    ws.onmessage = ({ data }) => {
      const { label, payload } = JSON.parse(data);
      if (label === 'PONG') {
        this.setState({
          visible: true,
        }, () => {
          this.context.setCount(payload[0] as number, () => {
            this.state.button?.current?.click();
          });
        });
      } else if (label === 'BYE') {
        this.setState({
          visible: false,
        }, () => {
          this.context.setCount(payload[0] as number, () => {
            ws.close();
          });
        });
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
    }));
    this.setState({
      visible: false,
    });
  }

  render() {
    return (this.state.visible 
      ? 
        <button
          ref={this.state.button}
          onClick={this.click.bind(this)}
          >
          Ping
        </button>
      :
        <button>Ping</button>
    );
  }
}