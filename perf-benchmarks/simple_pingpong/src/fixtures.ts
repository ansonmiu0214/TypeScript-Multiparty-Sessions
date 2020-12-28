import { performance } from 'perf_hooks';

export type Logs = string[];

export interface BenchmarkExecutor {
    (timer: Timer, numMessages: number, serverPort: number, clientPort: number, interactive: boolean): PromiseLike<Logs>;
};

export class Timer {

    static instance: Timer;

    private labelToStartTimeMillis: Map<string, number>;
    private lines: Logs;

    private constructor() {
        this.labelToStartTimeMillis = new Map();
        this.lines = [];
    }

    static getTimer() {
        return Timer.instance;
    }

    static newTimer() {
        const timer =  new Timer();
        Timer.instance = timer;
        return timer;
    }

    timeLog(label: string, ...data: any[]): void {
        const endTime = performance.now();
        const startTime = this.labelToStartTimeMillis.get(label)!;

        const duration = endTime - startTime;
        this.lines.push(`${label}: ${duration}ms ${data.join(" ")}`);
    }

    timeEnd(label: string): void {
        const endTime = performance.now();
        const startTime = this.labelToStartTimeMillis.get(label)!;

        const duration = endTime - startTime;
        this.lines.push(`${label}: ${duration}ms`);

    }

    time(label: string): void {
        const startTime = performance.now();
        this.labelToStartTimeMillis.set(label, startTime);
    }

    getLogs(): Logs {
        return this.lines;
    }

};