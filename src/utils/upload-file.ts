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
      const files = Array.from(input.files);
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

export function readDataURL(file: File): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader();

    reader.onload = async e => {
      const buffer = e.target.result as string;
      resolve(buffer);
    };

    reader.readAsDataURL(file);
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

export function getVideoMeta(
  data: ArrayBuffer
): Promise<[string, number, number]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const blob = new Blob([data]);
    const blobURL = URL.createObjectURL(blob);

    let width = 1;
    let height = 1;

    const snapImage = function() {
      var canvas = document.createElement("canvas");
      width = canvas.width = video.videoWidth;
      height = canvas.height = video.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);
      var image = canvas.toDataURL();
      var success = image.length > 10000;
      if (success) {
        resolve([image, width, height]);
        return image;
      }

      return undefined;
    };

    const timeupdate = function() {
      if (snapImage()) {
        video.removeEventListener("timeupdate", timeupdate);
        video.pause();
      }
    };

    video.onerror = () => {
      reject();
    };

    video.addEventListener("loadeddata", function() {
      const result = snapImage();
      if (result) {
        video.removeEventListener("timeupdate", timeupdate);
      }
    });

    video.addEventListener("timeupdate", timeupdate);
    video.preload = "metadata";
    video.src = blobURL;
    // Load video in Safari / IE11
    video.muted = true;
    (video as any).playsInline = true;
    video.play();
  });
}

export async function resizeImage(
  data: ArrayBuffer,
  contentType?: string
): Promise<[ArrayBuffer, number, number]> {
  const maxWidth = 1280;
  const maxHeight = 1280;
  const img = await readImage(data);
  let { width, height } = img;

  if (contentType === "image/jpeg" && width * height <= maxWidth * maxHeight) {
    console.log("Skipped resizing jpeg");
    return [data, width, height];
  }

  return new Promise(resolve => {
    const canvas = document.createElement("canvas");

    [width, height] = fitImageSize(width, height, maxWidth, maxHeight);
    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toBlob(
      blob => {
        new Response(blob).arrayBuffer().then(buffer => {
          resolve([buffer, width, height]);
        });
      },
      "image/jpeg",
      0.7
    );
  });
}

export function fitImageSize(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): [number, number] {
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

  return [width, height];
}
