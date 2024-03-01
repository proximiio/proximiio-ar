import { devLoadMap } from './localize';
import { state } from './state';
class WorkerHandler {
    constructor() {
        this.handleMessage = (event) => {
            const { type, data } = event.data;
            if (type === 'Init') {
                console.log(`MAIN PosePlugin init: [${data}]`);
                devLoadMap();
            }
            if (type == 'LoadMap') {
                console.log(`MAIN Map Loaded`);
                if (data >= 0) {
                    state.mapHandle = data;
                }
            }
            if (type === 'Localize') {
                const { r } = data;
                if (r >= 0) {
                    state.locCount++;
                    console.log('LOCALIZED SUCCESSFULLY');
                }
                state.isLocalizing = false;
            }
        };
        this.worker = new Worker(URL.createObjectURL(new Blob([`(${workerFunction})()`])));
        this.worker.addEventListener('message', this.handleMessage.bind(this));
    }
    postMessageToWorker(message) {
        this.worker.postMessage(message);
    }
}
export default WorkerHandler;
function workerFunction() {
    self.importScripts('https://pub-dc411ce328ca438c8229e569659d6ebb.r2.dev/PosePlugin.js');
    self.Module = {
        onRuntimeInitialized: function () {
            pluginInit(self.Module);
        },
    };
    function pluginInit(Module) {
        Module['icvGetInteger'] = this.cwrap('icvGetInteger', 'number', ['string']);
        Module['icvSetInteger'] = this.cwrap('icvSetInteger', 'number', [
            'string',
            'number',
        ]);
        Module['icvLoadMap'] = this.cwrap('icvLoadMap', 'number', ['number']);
        Module['icvFreeMap'] = this.cwrap('icvFreeMap', 'number', ['number']);
        Module['icvLocalize'] = this.cwrap('wasmLocalize', 'number', [
            'number',
            'number',
            'number',
            'number',
            'number',
            'number',
            'number',
            'number',
            'number',
        ]);
        function handleMessage(event) {
            const { type, data } = event.data;
            if (type == 'LoadMap') {
                const map = data;
                const ptrMap = this._malloc(map.length * map.BYTES_PER_ELEMENT);
                this.HEAPU8.set(map, ptrMap);
                let r = this._icvLoadMap(ptrMap);
                this._free(ptrMap);
                self.postMessage({ type: 'LoadMap', data: r });
            }
            if (type == 'FreeMap') {
                console.log('FreeMap Loaded');
                let r = this._icvFreeMap(data);
                self.postMessage({ type: 'FreeMap', data: r });
            }
            if (type === 'Localize') {
                const width = data[0];
                const height = data[1];
                const cameraIntrinsics = data[2];
                const pixels = data[3];
                const time = data[4];
                const gyro = data[5];
                const solverType = data[6];
                const cameraRotation = data[7];
                const camRot = new Float32Array([
                    cameraRotation.x,
                    cameraRotation.y,
                    cameraRotation.z,
                    cameraRotation.w,
                ]);
                let position = new Float32Array(3);
                let rotation = new Float32Array(4);
                let intrinsics = new Float32Array([
                    cameraIntrinsics.fx,
                    cameraIntrinsics.fy,
                    cameraIntrinsics.ox,
                    cameraIntrinsics.oy,
                ]);
                const ptrPix = this._malloc(pixels.length * pixels.BYTES_PER_ELEMENT);
                this.HEAPU8.set(pixels, ptrPix);
                const ptrPos = this._malloc(position.length * position.BYTES_PER_ELEMENT);
                this.HEAPF32.set(position, ptrPos >> 2);
                const ptrRot = this._malloc(rotation.length * rotation.BYTES_PER_ELEMENT);
                this.HEAPF32.set(rotation, ptrRot >> 2);
                const ptrIntrinsics = this._malloc(intrinsics.length * intrinsics.BYTES_PER_ELEMENT);
                this.HEAPF32.set(intrinsics, ptrIntrinsics >> 2);
                const ptrCamRot = this._malloc(camRot.length * camRot.BYTES_PER_ELEMENT);
                this.HEAPF32.set(camRot, ptrCamRot >> 2);
                let r = this._wasmLocalize(ptrPos, ptrRot, width, height, ptrIntrinsics, ptrPix, 4, solverType, ptrCamRot);
                if (r >= 0) {
                    position = this.HEAPF32.subarray(ptrPos >> 2, (ptrPos >> 2) + position.length);
                    rotation = this.HEAPF32.subarray(ptrRot >> 2, (ptrRot >> 2) + rotation.length);
                    intrinsics = this.HEAPF32.subarray(ptrIntrinsics >> 2, (ptrIntrinsics >> 2) + intrinsics.length);
                }
                const pos = [position[0], position[1], position[2]];
                const rot = [rotation[0], rotation[1], rotation[2], rotation[3]];
                const focalLen = intrinsics[0];
                const G = [gyro.x, gyro.y, gyro.z, gyro.w];
                this._free(ptrPix);
                this._free(ptrPos);
                this._free(ptrRot);
                this._free(ptrIntrinsics);
                this._free(ptrCamRot);
                self.postMessage({
                    type: 'Localize',
                    data: {
                        r: r,
                        pos: pos,
                        rot: rot,
                        time: time,
                        gyro: G,
                        focalLength: focalLen,
                    },
                });
            }
            if (type == 'GetInteger') {
                let r = this._icvGetInteger(data);
                self.postMessage({ type: 'GetInteger', data: r });
            }
            if (type == 'SetInteger') {
                let r = this._icvSetInteger(data[0], data[1]);
                self.postMessage({ type: 'SetInteger', data: r });
            }
        }
        let r = 0;
        self.addEventListener('message', handleMessage);
        self.postMessage({ type: 'Init', data: r });
    }
}
