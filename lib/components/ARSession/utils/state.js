import { Euler, Matrix4, Quaternion } from "three";
export const state = {
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
