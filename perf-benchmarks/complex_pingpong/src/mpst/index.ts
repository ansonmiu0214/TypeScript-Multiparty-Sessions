import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import cors from 'cors';
import WebSocket from 'ws';
import { BenchmarkExecutor, Timer } from '../fixtures';
import { Session, Svr } from './PingPong/Svr';

const Browser = require('zombie');

const main: BenchmarkExecutor = (timer: Timer, numMessages: number, serverPort: number, clientPort: number, interactive: boolean) => new Promise((resolve, reject) => {
    const app = express();
    const server = http.createServer(app);
    const wss = new WebSocket.Server({ server });

    const logic = Session.Initial({
        PING: (Next, count) => {
            timer.time(`pingpong${++count}`);
            if (count === numMessages) {
                return Next.BYE([count], Session.Terminal);
            } else {
                return Next.PONG([count], logic);
            }
        },
    });

    new Svr(wss, (role, reason) => {
        console.error(`  ${role} cancelled because of ${reason}`);
    }, (sessionID) => logic);

    server.listen(serverPort, () => {
        console.log(`  Listening on port ${serverPort}...`);

        const clientURL = `http://localhost:${clientPort}`;

        if (interactive) {
            console.log(`  Please visit ${clientURL} to start the benchmark.`);
        } else {
            new Browser().visit(clientURL, () => {
                console.log('  Loaded client page');
            });
        }
    });

    app.use(cors());
    app.use(bodyParser.json());
    app.post('/done', (req, res) => {
        res.send('OK');
        server.close(err => {
            if (err) {
                reject(err);
            } else {
                resolve(req.body);
            }
        });
    }); 
});

export default main;