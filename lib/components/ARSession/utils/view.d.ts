import { WebGLRenderer, PerspectiveCamera, Scene, Quaternion, Vector3, Mesh, Raycaster } from "three";
declare class ARCamView {
    renderer: WebGLRenderer;
    camera: PerspectiveCamera;
    scene: Scene;
    objects: Mesh[];
    raycaster: Raycaster;
    clickedObject?: any;
    applyPose: (pose: any, quaternion: Quaternion, position: Vector3) => void;
    constructor(container: HTMLElement, width: number, height: number);
    updateCameraPose(pose: any): void;
    lostCamera(): void;
    addObject(object: Mesh, x?: number, y?: number, z?: number, scale?: number): void;
    onClick(event: MouseEvent): void;
    reset(): void;
}
export { ARCamView };
