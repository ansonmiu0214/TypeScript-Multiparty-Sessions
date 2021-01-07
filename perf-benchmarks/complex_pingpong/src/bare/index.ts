import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import cors from 'cors';
import WebSocket from 'ws';
import { BenchmarkExecutor, Timer } from '../fixtures';

const Browser = require('zombie');

const main: BenchmarkExecutor = (timer: Timer, numMessages: number, serverPort: number, clientPort: number, interactive: boolean) => new Promise((resolve, reject) => {
    const app = express();
    const server = http.createServer(app);
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (socket) => {
        timer.time('benchmark');
        
        socket.onclose = (event: WebSocket.CloseEvent) => {
            timer.timeEnd('benchmark');
        };
        
        socket.onmessage = ({ data }) => {
            const { label, payload } = JSON.parse(data.toString());
            if (label === 'PING') {
                const count: number = payload[0] + 1;
                timer.time(`pingpong${count}`);
                if (count === numMessages) {
                    socket.send(JSON.stringify({
                        label: 'BYE',
                        payload: [count],
                    }));
                } else {
                    socket.send(JSON.stringify({
                        label: 'PONG',
                        payload: [count],
                    }));
                }
                timer.timeLog('benchmark', count);
                timer.timeEnd(`pingpong${count}`);
            } else {
                throw new Error(`Unrecognised label: ${label}`);
            }
        }
    });

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