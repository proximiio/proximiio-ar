import { Euler, Matrix4, Quaternion } from "three";
interface StateModel {
    $container?: HTMLElement;
    $view: HTMLElement;
    $canvas: HTMLCanvasElement;
    videoInited: boolean;
    constraints: MediaStreamConstraints;
    rotateDegrees: number;
    leftToRight: number;
    frontToBack: number;
    euler: Euler;
    q1: Quaternion;
    q3: Quaternion;
    gyroR: Matrix4;
    S: Matrix4;
    locCount: number;
    mapHandle: number;
    stream?: MediaStream;
    $video?: HTMLVideoElement;
    size?: {
        width: number;
        height: number;
        x: number;
        y: number;
    };
    pixels?: Uint8ClampedArray;
    ctx?: CanvasRenderingContext2D;
    frame?: ImageData;
    alva?: any;
    alvaView?: any;
    tween?: any;
    immersalToken?: string;
    immersalMapId?: number;
    destinationFeatureId?: string;
}
export declare const state: StateModel;
export {};
