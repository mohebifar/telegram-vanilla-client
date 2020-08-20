import { BigInteger as JBigInt } from "big-integer";
import { serializeTLObject, TLObjectTypes } from "../tl/types";

export class RequestState {
  public msgId: JBigInt = null;
  public containerId: JBigInt = null;
  public data: Uint8Array;
  public resolve: (state?: any) => void;
  public reject: (error?: any) => void;
  public promise: Promise<TLObjectTypes>;

  constructor(public request: TLObjectTypes) {
    this.data = serializeTLObject(request);

    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  get isRequest() {
    return this.request.$t.endsWith("Request");
  }
}
