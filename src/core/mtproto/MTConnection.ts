import { MTTransport } from "./MTTransport";
import { concatBuffers } from "../../utils/binary";
import { AsyncQueue } from "../extensions/AsyncQueue";

export class MTConnection {
  private socket: WebSocket;
  private transport: MTTransport;
  public waitForConnect: Promise<void>;
  private waitForObfuscate: Promise<void>;
  private waitForRead: Promise<boolean>;
  private resolveConnected: () => void;
  private resolveRead: (state: boolean) => void;
  private stream = new Uint8Array();
  private closed = false;
  private sendArray: AsyncQueue;
  private recvArray: AsyncQueue;
  public connected = false;

  constructor(private handleDisconnect?: Function) {}

  public async recv() {
    while (this.connected) {
      const result = await this.recvArray.pop();
      if (result) {
        return result;
      }
    }

    throw new Error("Not connected");
  }

  public async send(data: Uint8Array) {
    if (!this.connected) {
      throw new Error("Not connected");
    }
    await this.waitForObfuscate;

    const encodedPacket = this.transport.encodePacket(data);
    return await this.sendArray.push(encodedPacket);
  }

  public async connect(url: string) {
    this.socket = new WebSocket(url, "binary");
    this.transport = new MTTransport(this);
    this.waitForObfuscate = this.transport.initHeader();
    this.registerEvents();
    this.resetReadPromise();
    this.resetConnectPromise();
    this.recvArray = new AsyncQueue();
    this.sendArray = new AsyncQueue();
    await this.waitForConnect;
  }

  public disconnect() {
    this.socket.close();
    this.resolveRead(false);
  }

  // Private
  private async recvLoop() {
    let data: Uint8Array;
    while (this.connected) {
      try {
        const shouldContinue = await this.waitForRead;
        if (shouldContinue === false) {
          throw new Error("connection has been closed");
        }
        data = await this.transport.decodePacket();

        if (!data) {
          return;
        }

        await this.recvArray.push(data);
      } catch (e) {
        console.log(e, "Error occured in recieve loop");
        return;
      }
    }
  }

  private async sendloop() {
    try {
      while (this.connected) {
        const data = await this.sendArray.pop();
        this.write(data);
      }
    } catch (e) {
      console.log(e, "Error occured in send loop");
    }
  }

  private write(data: Uint8Array) {
    const encryptedData = this.transport.obfuscate(data);

    this.socket.send(encryptedData.buffer);
  }

  public async read(size: number) {
    if (this.closed) {
      throw new Error("Connection is closed");
    }

    await this.waitForRead;

    const result = this.stream.slice(0, size);
    this.stream = this.stream.slice(size);

    if (this.stream.length === 0) {
      this.resetReadPromise();
    }

    return result;
  }

  private onOpen = async () => {
    await this.waitForObfuscate;

    // Send the obfuscation 64-byte header
    this.socket.send(this.transport.header);

    this.connected = true;
    this.sendloop();
    this.recvLoop();
    this.resolveConnected();
  };

  private onData = async (event: MessageEvent) => {
    const buffer = await event.data.arrayBuffer();
    const rawData = new Uint8Array(buffer);
    const decryptedData = this.transport.deobfuscate(rawData);
    this.stream = concatBuffers([this.stream, decryptedData]);
    this.resolveRead(true);
  };

  private onClose = () => {
    if (this.handleDisconnect) {
      this.handleDisconnect();
    }
  };

  private resetReadPromise() {
    this.waitForRead = new Promise(r => {
      this.resolveRead = r;
    });
  }

  private resetConnectPromise() {
    this.waitForConnect = new Promise(r => {
      this.resolveConnected = r;
    });
  }

  private registerEvents() {
    this.socket.addEventListener("open", this.onOpen);
    this.socket.addEventListener("message", this.onData);
    this.socket.addEventListener("close", this.onClose);
  }
}
