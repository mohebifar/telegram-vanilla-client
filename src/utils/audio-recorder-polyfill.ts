import OpusMediaRecorder from "opus-media-recorder";
// @ts-ignore
import EncoderWorker from "worker-loader!opus-media-recorder/encoderWorker.js";
import OggOpusWasm from "!file-loader!opus-media-recorder/OggOpusEncoder.wasm";

export default function mediaRecorderFactory(stream: MediaStream) {
  const workerOptions = {
    encoderWorkerFactory: () => new EncoderWorker(),
    OggOpusEncoderWasmPath: OggOpusWasm,
  };

  return new OpusMediaRecorder(
    stream,
    { mimeType: "audio/ogg" },
    workerOptions
  );
}
