declare module '*.scss'
declare module '*.css'
declare module '@waline/client/style'
declare module '*.module.scss' {
  const classes: Record<string, string>
  export default classes
}

declare module 'gif2asciiart' {
  interface GifAsciiFrame {
    /** ASCII string, length w*h, indexed by c[y*w + x] */
    c: string
    /** Frame delay in milliseconds */
    d: number
  }
  interface GifAsciiResult {
    w: number
    h: number
    ow: number
    oh: number
    total: number
    loop: number
    frames: GifAsciiFrame[]
  }
  interface GifAsciiOptions {
    sampleX?: number
    sampleY?: number
    brightnessCutoff?: number
    asciiChars?: { dark: string[]; gray: string[]; light: string[] }
    grayscaleMap?: Array<{ max: number; pool: string }>
    invertChars?: boolean
  }
  export function gifToAscii(arrayBuffer: ArrayBuffer, opts?: GifAsciiOptions): GifAsciiResult
}
