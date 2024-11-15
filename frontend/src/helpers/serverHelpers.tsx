interface User {
  email: string;
  name: string;
  presentations: number[];
  avatar: string;
}

interface UserInfo {
  name: string;
  email: string;
  avatar: string;
}

interface Presentation {
  name: string;
  pId: string;
  history: number[];
  slides: Slide[];
  thumbnail: string;
  description: string;
}

interface Slide {
  sId: string;
  img: string;
  elements: Element[];
}
enum ElementTypes {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  CODE = "code",
}

interface Element {
  id: string;
  type: ElementTypes;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  fontSize?: number;
  color?: string;
  alt?: string;
  description?: string;
  autoplay?: string;
}

interface History {
  hId: string;
  timestamp: number;
  slides: Slide[];
}

interface Store {
  user: User;
  presentations: Presentation[];
  history: History[];
}

interface ContainerSize {
  width: number;
  height: number;
}

/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 *
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file: File): Promise<string> {
  const validFileTypes = ["image/jpeg", "image/png", "image/jpg"] as const;
  const valid = validFileTypes.find((type) => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw new Error("provided file is not a png, jpg or jpeg image.");
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise<string>((resolve, reject) => {
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("File reading failed."));
      }
    };
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

export type { Store, Presentation, UserInfo, Slide, Element, ContainerSize };
export { ElementTypes };
