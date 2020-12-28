import { ArgumentParser } from 'argparse';
import fs from 'fs/promises';

import { Logs, Timer } from './fixtures';
import bare from './bare';
import bare_safe from './bare_safe';
import mpst from './mpst';

const executors = {
    bare,
    bare_safe,
    mpst,
};

type Variant = keyof (typeof executors);

const DEFAULT_SERVER_PORT = 8080;
const DEFAULT_CLIENT_PORT = 5000;

const writeLogs = async (timestamp: number, numMessages: number, variant: Variant, clientLogs: Logs, serverLogs: Logs) => {
    const filename = `${numMessages}_${timestamp}_${variant}.log`;
    const clientDir = `logs/${variant}/client`;
    const serverDir = `logs/${variant}/server`;

    try {
        await fs.mkdir(clientDir, { recursive: true });
        await fs.mkdir(serverDir, { recursive: true });
    
        await fs.writeFile(`${clientDir}/${filename}`, clientLogs.join('\n'));
        await fs.writeFile(`${serverDir}/${filename}`, serverLogs.join('\n'));
    } catch (error) {
        console.error(error);
    }
};

const setupArgumentParser = () => {
    const parser = new ArgumentParser({
        add_help: true,
    });

    parser.add_argument('-m', '--messages', {
        type: Number,
        help: 'number of messages to exchange during PingPong',
        required: true,
    });
    parser.add_argument('-r', '--runs', {
        type: Number,
        help: 'number of PingPong protocols to execute',
        default: 1,
    });
    parser.add_argument('-v', '--variant', {
        help: `choose from: ${Object.keys(executors).map(key => `"${key}"`).join()}`,
        required: true,
    });
    parser.add_argument('-s', '--server-port', {
        help: 'server port',
        type: Number,
        default: DEFAULT_SERVER_PORT,
    });
    parser.add_argument('-c', '--client-port', {
        help: 'client port',
        type: Number,
        default: DEFAULT_CLIENT_PORT,
    });
    parser.add_argument('-i', '--interactive', {
        help: 'toggle to run benchmark interactively, otherwise a headless browser is used',
        action: 'store_true',
        default: false,
    })

    return parser;
};

const main = async () => {
    const parser = setupArgumentParser();
    const args = parser.parse_args();

    console.info('Benchmark Configuration');
    console.info('-----------------------');
    Object.entries(args).forEach(([key, val]) => {
        console.info(`  ${key}: ${val}`);
    });
    console.info();
    
    const messages: number = args.messages;
    const runs: number = args.runs;
    const variant: Variant = args.variant;
    const serverPort: number = args.server_port;
    const clientPort: number = args.client_port;
    const interactive: boolean = args.interactive;

    const runBenchmark = executors[variant];

    for (let run = 1; run <= runs; ++run) {
        console.info(`Run #${run}/${runs}`);

        const timestamp = Date.now();
        const serverTimer = Timer.newTimer();

        const clientLogs = await runBenchmark(serverTimer, messages, serverPort, clientPort, interactive);
        console.info('  [√] Complete protocol');

        const serverLogs = serverTimer.getLogs();

        await writeLogs(timestamp, messages, variant, clientLogs, serverLogs);
        console.info('  [√] Write logs to file system');
        console.info();
    }
};

main().then(() => {
    console.info();
    console.info('Visualise results using the provided notebook.');

    process.exit(0);
}).catch(error => {
    console.error(error);

    process.exit(1);
});

