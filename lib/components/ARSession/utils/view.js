import { WebGLRenderer, PerspectiveCamera, Scene, AmbientLight, HemisphereLight, Raycaster, DirectionalLight, } from 'three';
import { AlvaARConnectorTHREE } from './vendor/alva_ar_three.js';
import { state } from './state';
import { devLocalize } from './localize';
import { ARSession } from '../main';
class ARCamView {
    constructor(container, width, height) {
        console.log('ARCamView');
        this.applyPose = AlvaARConnectorTHREE.Initialize();
        this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x000000, 0); // Fixing the clear color argument
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.domElement.addEventListener('click', this.onClick.bind(this), true);
        this.raycaster = new Raycaster();
        this.camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.rotation.reorder('YXZ');
        this.camera.updateProjectionMatrix();
        this.objects = [];
        this.scene = new Scene();
        this.scene.add(new AmbientLight(0x808080));
        this.scene.add(new HemisphereLight(0x404040, 0xf0f0f0));
        const directionalLight = new DirectionalLight(0xffffff); // White light from a direction
        directionalLight.position.set(1, 1, 10); // Set the direction of the light
        this.scene.add(directionalLight);
        this.scene.add(this.camera);
        container.appendChild(this.renderer.domElement);
        const renderLoop = (time) => {
            if (state.mapHandle >= 0) {
                devLocalize(time);
            }
            if (state.frame) {
                const pose = state.alva.findCameraPose(state.frame);
                if (pose) {
                    if (state.locCount > 1)
                        this.updateCameraPose(pose);
                }
                else {
                    this.lostCamera();
                }
            }
            if (this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        };
        this.renderer.setAnimationLoop(renderLoop);
    }
    updateCameraPose(pose) {
        this.applyPose(pose, this.camera.quaternion, this.camera.position);
        this.objects.forEach((object) => (object.visible = true));
    }
    lostCamera() {
        this.objects.forEach((object) => (object.visible = false));
        state.locCount = 0;
        if (state.ctx) {
            const dots = state.alva.getFramePoints();
            for (const p of dots) {
                state.ctx.fillStyle = 'white';
                state.ctx.fillRect(p.x, p.y, 2, 2);
            }
        }
    }
    addObject(object, x = 0, y = 0, z = -10, scale = 1.0) {
        object.scale.set(scale, scale, scale);
        object.position.set(x, y, z);
        this.scene.add(object);
        this.objects.push(object);
    }
    onClick(event) {
        const mouse = {
            x: (event.clientX / window.innerWidth) * 2 - 1,
            y: -(event.clientY / window.innerHeight) * 2 + 1,
        };
        this.raycaster.setFromCamera(mouse, this.camera);
        // Find intersected objects
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        // Check if any object was intersected
        if (intersects.length > 0) {
            // Handle click on intersected object
            this.clickedObject = intersects[0].object;
            if (this.clickedObject.visible &&
                this.clickedObject.userData.destinationFeatureId &&
                this.clickedObject.userData.ad) {
                state.destinationFeatureId =
                    this.clickedObject.userData.destinationFeatureId;
                ARSession.stop(state.destinationFeatureId);
            }
        }
    }
    reset() {
        this.applyPose = null;
        this.renderer.domElement.removeEventListener('click', this.onClick.bind(this), true);
        this.renderer.domElement.remove();
        this.renderer.resetState();
        this.renderer.setAnimationLoop(null);
        this.renderer = null;
        this.raycaster = null;
        this.camera = null;
        this.scene = null;
    }
}
export { ARCamView };
