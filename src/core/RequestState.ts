import { TLObjectTypes, serializeTLObject } from "./tl/types";

export class RequestState {
  public msgId: bigint = null;
  public containerId: bigint = null;
  public isRequest = false;
  public data: Uint8Array;
  public resolve: (state?: any) => void;
  public reject: (error?: any) => void;
  public promise: Promise<TLObjectTypes>;

  constructor(public request: TLObjectTypes) {
    this.data = serializeTLObject(request);
    this.isRequest = request.$t.endsWith("Request");

    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
