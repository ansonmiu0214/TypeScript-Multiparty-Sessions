import React from 'react';
import './HigherOrderCalculator.css';

import { LogicContext, Operand } from '../Logic'
import { SendComponentFactory, } from '../CompactCalculator/Client/Session';
import { Constructor } from '../CompactCalculator/Client/Types';

type P = {
    Add?: SendComponentFactory<[number, number]>,
    Mult?: SendComponentFactory<[number, number]>,
    Double?: SendComponentFactory<[number]>,
    Quit?: SendComponentFactory<[]>,
}

type S = {
    value: number,
    operand: Operand,
}

class HigherOrderCalculator extends React.Component<P, S> {

    static contextType = LogicContext;
    declare context: React.ContextType<typeof LogicContext>;

    constructor(props: P) {
        super(props);
        this.state = {
            value: 0,
            operand: Operand.Double
        }
    }

    componentDidMount() {
        this.setState({
            value: this.context.current,
            operand: this.context.operand,
        });
    }

    modifyValue = (n: number) => (_: React.MouseEvent) => {
        this.context.digitPressed(n);
        // this.setState({ value: this.context.digitPressed(n) })
    }

    pushOperation = (op: Operand) => (_: React.MouseEvent) => {
        this.context.setOperand(op);
        this.context.storeValue();
        this.setState({
            operand: op,
        });
    }

    render() {
        let Elem: Constructor<React.Component> | undefined
        switch (this.state.operand) {
            case Operand.Add: {
                Elem = this.props.Add?.('onClick', event => {
                    const x = this.context.current;
                    const y = this.context.retrieveValue();
                    console.log('adding', x, y)

                    return [x, y]
                });
                break;
            }
            case Operand.Mult: {
                Elem = this.props.Mult?.('onClick', event => {
                    return [this.context.current, this.context.retrieveValue()]
                });
                break;
            }
            case Operand.Double: {
                Elem = this.props.Double?.('onClick', event => {
                    return new Promise((resolve, _) => {
                        setTimeout(() => resolve([this.context.current]), 3000);
                    })
                });
            }
        }

        console.log(this.state.operand, Elem);

        let QuitElem = this.props.Quit?.('onClick', event => {
            console.log('Clicking quit!');
            return []
        })

        return (
            <div>
                <div id='result'>{this.context.current}</div>

                <div className="buttons">
                    <div className='numbers'>
                        {[7,8,9,4,5,6,1,2,3,0].map((n, key) => (
                            <div className='button number' key={key} onClick={this.modifyValue(n)}>{n}</div>
                        ))}
                    </div>
                    <div className="operations">
                        <div className='button operation' onClick={this.pushOperation(Operand.Add)}>+</div>
                        <div className='button operation' onClick={this.pushOperation(Operand.Mult)}>*</div>
                        {this.state.operand === Operand.Double && Elem
                        ? <Elem><div className='button operation active'>x2</div></Elem> 
                        : <div className='button operation'>x2</div>
                        }

                        {this.state.operand !== Operand.Double && Elem ? <Elem><div className='button operation active'>=</div></Elem>
                        : <div className='button operation'>=</div>}
                    </div>
                </div>

                {QuitElem ? 
                <QuitElem><div id="quit">Quit</div></QuitElem> : <div id="quit">Quit</div>}
                
            </div>
        );
    }
}

export default HigherOrderCalculator;