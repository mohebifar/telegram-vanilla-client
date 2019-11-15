export class AsyncQueue {
  private queue: Uint8Array[] = [];
  private canGet: Promise<void>;
  private canPush: Promise<void>;
  private resolveGet: () => void;
  private resolvePush: () => void;

  constructor() {
    this.resetPromise("canGet");
    this.resetPromise("canPush");
    this.resolvePush();
  }

  private resetPromise(name: "canGet" | "canPush") {
    switch (name) {
      case "canGet":
        this.canGet = new Promise(resolve => {
          this.resolveGet = resolve;
        });
        break;
      case "canPush":
        this.canPush = new Promise(resolve => {
          this.resolvePush = resolve;
        });
        break;
    }
  }

  async push(value: Uint8Array) {
    await this.canPush;
    this.queue.push(value);
    this.resolveGet();
    this.resetPromise("canPush");
  }

  async pop() {
    await this.canGet;
    const result = this.queue.pop();
    this.resolvePush();
    this.resetPromise("canGet");
    return result;
  }
}
