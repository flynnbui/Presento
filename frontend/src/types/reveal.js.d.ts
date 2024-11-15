declare module "reveal.js" {
  interface RevealOptions {
    width?: number;
    height?: number;
    controls?: boolean;
    progress?: boolean;
    center?: boolean;
    hash?: boolean;
    transition?: string;
    margin?: number;
    minScale?: number;
    maxScale?: number;
    embedded?: boolean;
    touch?: boolean;
  }

  class Reveal {
    constructor(options?: RevealOptions);
    initialize(options?: { container: HTMLElement }): Promise<void>;
    destroy(): void;
  }

  export default Reveal;
}
