export default AlvaARWasm;
declare function AlvaARWasm(AlvaARWasm?: {}): any;
export class AlvaAR {
    static Initialize(width: any, height: any, fov?: number): Promise<AlvaAR>;
    constructor(wasm: any, width: any, height: any, fov: any);
    wasm: any;
    intrinsics: {
        width: any;
        height: any;
        fov: number;
        near: number;
        far: number;
        fx: number;
        fy: number;
        cx: number;
        cy: number;
        k1: number;
        k2: number;
        k3: number;
        p1: number;
        p2: number;
    };
    memCam: SharedMemory;
    memObj: SharedMemory;
    memPts: SharedMemory;
    memIMU: SharedMemory;
    memImg: SharedMemory;
    system: any;
    getCameraIntrinsics(width: any, height: any, fov?: number, near?: number, far?: number): {
        width: any;
        height: any;
        fov: number;
        near: number;
        far: number;
        fx: number;
        fy: number;
        cx: number;
        cy: number;
        k1: number;
        k2: number;
        k3: number;
        p1: number;
        p2: number;
    };
    findCameraPoseWithIMU(frame: any, orientation: any, motion: any): Uint8Array | Int8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;
    findCameraPose(frame: any): Uint8Array | Int8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;
    findPlane(numIterations?: number): Uint8Array | Int8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;
    getFramePoints(): any[];
    reset(): void;
}
declare class SharedMemory {
    constructor(wasm: any, type: any, size: any);
    wasm: any;
    type: any;
    ptr: any;
    TypedArray: Uint8ArrayConstructor | Int8ArrayConstructor | Int16ArrayConstructor | Uint16ArrayConstructor | Int32ArrayConstructor | Uint32ArrayConstructor | Float32ArrayConstructor | Float64ArrayConstructor;
    heap: Uint8Array | Int8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;
    write(data: any): void;
    read(length: any): Uint8Array | Int8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;
    dispose(): void;
}
