import { Quaternion } from 'three/src/math/Quaternion.js';
import { state } from './state';
import { createCanvas } from './utils';
import WorkerHandler from './workerHandler';
const baseUrl = 'https://api.immersal.com/';
const downloadMap = 'map';
const SOLVER_TYPE = 1; // 0 == default, 1 == "lean"
const _Q = new Quaternion();
const Qrot = new Quaternion();
let locWidth = 0;
let locHeight = 0;
let worker = new WorkerHandler();
const imageDownScale = 0.25;
const focalLen = 0;
const focalLenConfidence = 0;
export const initLocalizeWorker = () => {
    // worker = new WorkerHandler();
};
export const devLocalize = (time) => {
    getImageData();
    if (state.isLocalizing || !state.videoInited || !state.alva) {
        return;
    }
    state.isLocalizing = true;
    if (!state.pixels) {
        state.isLocalizing = false;
        return;
    }
    _Q.setFromRotationMatrix(state.gyroR);
    const gyro = { x: _Q.x, y: _Q.y, z: _Q.z, w: _Q.w };
    const intr = {
        fx: 0.0,
        fy: 0.0,
        ox: 0.5 * locWidth,
        oy: 0.5 * locHeight,
    };
    const camRot = { x: 0, y: 0, z: 0, w: 1 };
    if (SOLVER_TYPE === 1) {
        _Q.multiply(Qrot); // rotate 180 on X
        camRot.x = _Q.x;
        camRot.y = _Q.y;
        camRot.z = _Q.z;
        camRot.w = _Q.w;
    }
    if (focalLenConfidence === 1)
        intr.fx = intr.fy = focalLen;
    else
        intr.fx = intr.fy = 0.0;
    worker.postMessageToWorker({
        type: 'Localize',
        data: [
            locWidth,
            locHeight,
            intr,
            state.pixels,
            time,
            gyro,
            SOLVER_TYPE,
            camRot,
        ],
    });
};
const getImageData = () => {
    if (!state.ctx || !state.$video || !state.size) {
        return;
    }
    // handle SLAM
    state.ctx.clearRect(0, 0, state.$canvas.width, state.$canvas.height);
    state.ctx.drawImage(state.$video, 0, 0, state.$video.videoWidth, state.$video.videoHeight, state.size.x, state.size.y, state.size.width, state.size.height);
    state.frame = state.ctx.getImageData(0, 0, state.$canvas.width, state.$canvas.height);
    // handle localization
    locWidth = imageDownScale * state.$video.videoWidth;
    locHeight = imageDownScale * state.$video.videoHeight;
    const _canvas = createCanvas(locWidth, locHeight);
    const _ctx = _canvas.getContext('2d', { willReadFrequently: true });
    _ctx.drawImage(state.$video, 0, 0, state.$video.videoWidth, state.$video.videoHeight, 0, 0, locWidth, locHeight);
    state.pixels = _ctx.getImageData(0, 0, locWidth, locHeight).data;
};
export const devLoadMap = () => {
    const url = `${baseUrl}${downloadMap}?token=${state.immersalToken}&id=${state.immersalMapId}`;
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    xhr.onload = (e) => {
        console.log('xhr onload', e);
        const xhrTarget = e.target;
        if (xhrTarget.response) {
            const map = new Uint8Array(xhrTarget.response);
            worker.postMessageToWorker({ type: 'LoadMap', data: map });
        }
    };
    xhr.open('GET', url);
    xhr.send();
};
