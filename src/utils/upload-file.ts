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
  return new Promise(resolve => {
    const reader = new FileReader();

    reader.onload = async e => {
      const buffer = e.target.result as ArrayBuffer;
      resolve(buffer);
    };

    reader.readAsArrayBuffer(file);
  });
}

export function readImage(data: ArrayBuffer): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    const image = new Image();
    const blob = new Blob([data]);
    const blobURL = URL.createObjectURL(blob);

    image.onload = function() {
      resolve(image);
    };
    image.src = blobURL;
  });
}

export async function resizeImage(
  data: ArrayBuffer,
  contentType?: string
): Promise<ArrayBuffer> {
  const maxWidth = 1000;
  const maxHeight = 1000;
  const img = await readImage(data);
  let { width, height } = img;

  if (contentType === "image/jpeg" && width * height <= maxWidth * maxHeight) {
    console.log("Skipped resizing jpeg");
    return data;
  }

  return new Promise(resolve => {
    const canvas = document.createElement("canvas");

    if (width > height) {
      if (width > maxWidth) {
        //height *= maxWidth / width;
        height = Math.round((height *= maxWidth / width));
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        //width *= maxHeight / height;
        width = Math.round((width *= maxHeight / height));
        height = maxHeight;
      }
    }

    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toBlob(
      blob => {
        new Response(blob).arrayBuffer().then(buffer => {
          resolve(buffer);
        });
      },
      "image/jpeg",
      0.7
    );
  });
}
