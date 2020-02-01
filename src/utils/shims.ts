export default function setupShims() {
  // @ts-ignore
  // File.prototype.arrayBuffer = File.prototype.arrayBuffer || myArrayBuffer;
  // @ts-ignore
  Blob.prototype.arrayBuffer = Blob.prototype.arrayBuffer || myArrayBuffer;

  function myArrayBuffer() {
    // this: File or Blob
    return new Promise(resolve => {
      let fr = new FileReader();
      fr.onload = () => {
        resolve(fr.result);
      };
      fr.readAsArrayBuffer(this);
    });
  }
}
