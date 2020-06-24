import React from 'react';

import S61 from '../CompactCalculator/Client/S61'
import HigherOrderCalculator from './HigherOrderCalculator'

import { LogicContext } from '../Logic';

export default class SelectOperation extends S61 {

    static contextType = LogicContext
    declare context: React.ContextType<typeof LogicContext>

    render() {
        return  (
            <div>
                {/* <h1>Context: {this.context.current()}</h1> */}
                <HigherOrderCalculator
                    Add={this.Add.bind(this)}
                    Mult={this.Mult.bind(this)}
                    Double={this.Double.bind(this)}
                    Quit={this.Quit.bind(this)}
                />
            </div>
        );
        
    }

}

type Prop<Impl> = Impl extends S61<infer P> ? P : unknown;
type BaseProp<Impl> = Impl extends React.Component<infer P> ? P : unknown;

type Constructor<T> = new (...args: any[]) => T

export function proxy<Impl extends S61>(Cnstr: Constructor<Impl>, prop: Prop<Impl>) {
    return class extends S61 {
        render() {
            const props = {...prop, ...this.props};
            return <Cnstr {...props}/>
        }
    }
}