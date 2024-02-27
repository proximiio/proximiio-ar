declare const rad2deg: number;
declare const deg2rad: number;
declare function onFrame(frameTickFn: (timestamp: number) => Promise<boolean>, fps?: number): void;
declare function isIOS(): boolean;
declare function isMobile(): boolean;
declare function getScreenOrientation(): "portrait" | "landscape_left" | "landscape_right" | "unknown";
interface Rect {
    width: number;
    height: number;
    x: number;
    y: number;
}
declare function resize2cover(srcW: number, srcH: number, dstW: number, dstH: number): Rect;
declare function createCanvas(width: number, height: number): HTMLCanvasElement;
declare class Camera {
    el: HTMLVideoElement;
    width: number;
    height: number;
    _canvas: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D;
    static Initialize(constraints?: MediaStreamConstraints | null): Promise<Camera>;
    constructor(videoElement: HTMLVideoElement);
    getImageData(): ImageData;
}
declare class Video {
    el: HTMLVideoElement;
    width: number;
    height: number;
    _canvas: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D;
    _lastTime: number | null;
    _imageData: ImageData | null;
    static Initialize(url: string, timeout?: number): Promise<Video>;
    constructor(videoElement: HTMLVideoElement);
    getImageData(): ImageData;
}
export { Camera, Video, onFrame, isMobile, isIOS, getScreenOrientation, resize2cover, rad2deg, deg2rad, createCanvas, };
