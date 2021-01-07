export default class Timer {

    static instance?: Timer;

    private labelToStartTimeMillis: Map<string, number>;
    private lines: string[];

    private constructor() {
        this.labelToStartTimeMillis = new Map();
        this.lines = [];
    }

    private static getTimer(): Timer {
        if (!Timer.instance) {
            Timer.instance = new Timer();
        }

        return Timer.instance;
    }

    static timeLog(label: string, ...data: any[]) {
        Timer.getTimer().timeLog(label, ...data);
    }

    static timeEnd(label: string): void {
        Timer.getTimer().timeEnd(label);
    }

    static time(label: string): void {
        Timer.getTimer().time(label);
    }

    static async end() {
        await Timer.getTimer().end();
    }

    private timeLog(label: string, ...data: any[]): void {
        const endTime = window.performance.now();
        const startTime = this.labelToStartTimeMillis.get(label)!;

        const duration = endTime - startTime;
        this.lines.push(`${label}: ${duration}ms ${data.join(" ")}`);
    }

    private timeEnd(label: string): void {
        const endTime = window.performance.now();
        const startTime = this.labelToStartTimeMillis.get(label)!;

        const duration = endTime - startTime;
        this.lines.push(`${label}: ${duration}ms`);

    }

    private time(label: string): void {
        const startTime = window.performance.now();
        this.labelToStartTimeMillis.set(label, startTime);
    }

    private async end() {
        await fetch('http://localhost:8080/done', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.lines),
        });
    }

};