let id = 0;

export function makeFileDialog(
  contentType: string,
  multiple: true,
  callback: (file: File[]) => any
): string;

export function makeFileDialog(
  contentType: string,
  multiple: false,
  callback: (file: File) => any
): string;

export function makeFileDialog(
  contentType: string,
  multiple: boolean,
  callback: (file: any) => any
) {
  const input = document.createElement("input");
  input.className = "hidden";
  input.type = "file";
  input.multiple = multiple;
  input.accept = contentType;

  input.addEventListener(
    "change",
    () => {
      console.log("input changed");
      const files = Array.from(input.files);
      console.log("files", files);
      callback(multiple ? files : files[0]);
    },
    { once: false }
  );

  const elementId = "fi-" + id++;
  input.setAttribute("id", elementId);

  document.body.append(input);

  return elementId;
}

export function readFile(file: File): Promise<ArrayBuffer> {
  const reader = new FileReader();
  return new Promise(resolve => {
    reader.onload = async e => {
      const buffer = e.target.result as ArrayBuffer;
      resolve(buffer);
    };

    reader.readAsArrayBuffer(file);
  });
}
