import React from 'react';

import S64 from '../CompactCalculator/Client/S109';
import HigherOrderCalculator from './HigherOrderCalculator';
import { LogicContext } from '../Logic';



export default class ReceiveRes extends S64<{
    setRes: (res: number) => void
}> {

    static contextType = LogicContext;
    declare context: React.ContextType<typeof LogicContext>

    constructor(props: any) {
        super(props);
        console.log('hello');
    }

    render() {
        return (
            <HigherOrderCalculator />
        );
    }

    Res(n: number) {
        // return new Promise((resolve, reject) => {
        //     console.log('Received', n);
        //     Logic.current = n;
        //     setTimeout(() => resolve(void), 5000);
        // });

        console.log(this.context);
        this.context.setCurrent(n);
    }
    
}