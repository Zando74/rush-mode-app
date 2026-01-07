export interface CronHandler {
  handle(): Promise<void>;
}

export abstract class BaseCron {
  interval: NodeJS.Timeout;

  constructor(interval: number) {
    // should not start automatic cron in test environment
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    this.dispatch(interval);
  }

  abstract handle(): Promise<void>;

  public dispatch(interval: number): void {
    if (!this.interval) {
      this.interval = setInterval(async () => {
        await this.handle();
      }, interval);
    }
  }

  stop(): void {
    clearInterval(this.interval);
  }
}
