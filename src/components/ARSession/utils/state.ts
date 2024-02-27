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
  size?: { width: number; height: number; x: number; y: number };
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

export const state: StateModel = {
  videoInited: false,
  constraints: {
    video: {
      facingMode: "environment",
      aspectRatio: 16 / 9,
      width: { ideal: 1280 },
    },
    audio: false,
  },
  rotateDegrees: 0,
  leftToRight: 0,
  frontToBack: 0,
  euler: new Euler(),
  q1: new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)),
  q3: new Quaternion(),
  gyroR: new Matrix4(),
  S: new Matrix4(),
  locCount: 0,
  mapHandle: -1,
  $view: document.createElement("view"),
  $canvas: document.createElement("canvas"),
};
