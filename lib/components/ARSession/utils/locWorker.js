export class WorkerComponent {
    constructor() {
        console.log('new worker component');
        this.module = null;
        this.moduleReady = this.initializeModule();
        this.events = { message: () => { } };
    }
    async initializeModule() {
        return new Promise((resolve) => {
            self.Module = {
                onRuntimeInitialized: () => {
                    this.module.icvGetInteger = self.Module.cwrap('icvGetInteger', 'number', ['string']);
                    this.module.icvSetInteger = self.Module.cwrap('icvSetInteger', 'number', ['string', 'number']);
                    this.module.icvLoadMap = self.Module.cwrap('icvLoadMap', 'number', ['number']);
                    this.module.icvFreeMap = self.Module.cwrap('icvFreeMap', 'number', ['number']);
                    this.module.icvLocalize = self.Module.cwrap('wasmLocalize', 'number', Array(9).fill('number'));
                    let r = 0;
                    postMessage({ type: 'Init', data: r });
                    resolve();
                },
            };
        });
    }
    async ensureModuleReady() {
        if (!this.moduleReady) {
            throw new Error('Module not initialized');
        }
        await this.moduleReady;
    }
    // Method to set event listener for message event
    onMessage(callback) {
        this.events.message = callback;
    }
    async handleMessage(e) {
        const { type, data } = e.data;
        await this.ensureModuleReady();
        if (type == 'LoadMap') {
            const map = data;
            const ptrMap = this.module._malloc(map.length * map.BYTES_PER_ELEMENT);
            this.module.HEAPU8.set(map, ptrMap);
            let r = this.module.icvLoadMap(ptrMap);
            this.module._free(ptrMap);
            self.postMessage({ type: 'LoadMap', data: r });
        }
        if (type == 'FreeMap') {
            let r = this.module.icvFreeMap(data);
            self.postMessage({ type: 'FreeMap', data: r });
        }
        if (type == 'Localize') {
            const { width, height, cameraIntrinsics, pixels, time, gyro, solverType, cameraRotation, } = data;
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
            const ptrPix = this.module._malloc(pixels.length * pixels.BYTES_PER_ELEMENT);
            this.module.HEAPU8.set(pixels, ptrPix);
            const ptrPos = this.module._malloc(position.length * position.BYTES_PER_ELEMENT);
            this.module.HEAPF32.set(position, ptrPos >> 2);
            const ptrRot = this.module._malloc(rotation.length * rotation.BYTES_PER_ELEMENT);
            this.module.HEAPF32.set(rotation, ptrRot >> 2);
            const ptrIntrinsics = this.module._malloc(intrinsics.length * intrinsics.BYTES_PER_ELEMENT);
            this.module.HEAPF32.set(intrinsics, ptrIntrinsics >> 2);
            const ptrCamRot = this.module._malloc(camRot.length * camRot.BYTES_PER_ELEMENT);
            this.module.HEAPF32.set(camRot, ptrCamRot >> 2);
            let r = this.module.icvLocalize(ptrPos, ptrRot, width, height, ptrIntrinsics, ptrPix, 4, solverType, ptrCamRot);
            if (r >= 0) {
                position = this.module.HEAPF32.subarray(ptrPos >> 2, (ptrPos >> 2) + position.length);
                rotation = this.module.HEAPF32.subarray(ptrRot >> 2, (ptrRot >> 2) + rotation.length);
                intrinsics = this.module.HEAPF32.subarray(ptrIntrinsics >> 2, (ptrIntrinsics >> 2) + intrinsics.length);
            }
            const pos = [position[0], position[1], position[2]];
            const rot = [rotation[0], rotation[1], rotation[2], rotation[3]];
            const focalLen = intrinsics[0];
            const G = [gyro.x, gyro.y, gyro.z, gyro.w];
            this.module._free(ptrPix);
            this.module._free(ptrPos);
            this.module._free(ptrRot);
            this.module._free(ptrIntrinsics);
            this.module._free(ptrCamRot);
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
            let r = this.module.icvGetInteger(data);
            self.postMessage({ type: 'GetInteger', data: r });
        }
        if (type == 'SetInteger') {
            let r = this.module.icvSetInteger(data[0], data[1]);
            self.postMessage({ type: 'SetInteger', data: r });
        }
        this.events.message(e);
    }
}
const workerComponent = new WorkerComponent();
// Fetch the content of the external script
fetch('https://pub-dc411ce328ca438c8229e569659d6ebb.r2.dev/PosePlugin.js')
    .then((response) => response.text())
    .then((scriptContent) => {
    // Create a Blob containing the script content
    const blob = new Blob([scriptContent], { type: 'application/javascript' });
    // Create a URL for the Blob
    const blobUrl = URL.createObjectURL(blob);
    // Create a new Worker with the Blob URL
    const worker = new Worker(blobUrl);
    // Handle incoming messages from the worker
    worker.onmessage = async (event) => {
        console.log('kokot', event);
        await workerComponent.handleMessage(event);
    };
})
    .catch((error) => {
    console.error('Error fetching script:', error);
});
// Handle incoming messages
onmessage = async (e) => {
    console.log('on message', e);
    await workerComponent.handleMessage(e);
};
