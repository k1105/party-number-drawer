declare module 'qrious' {
  interface QRiousOptions {
    element?: HTMLElement;
    background?: string;
    backgroundAlpha?: number;
    foreground?: string;
    foregroundAlpha?: number;
    level?: 'L' | 'M' | 'Q' | 'H';
    mime?: string;
    padding?: number;
    size?: number;
    value?: string;
  }

  class QRious {
    constructor(options?: QRiousOptions);
    toDataURL(mime?: string): string;
  }

  export default QRious;
}
