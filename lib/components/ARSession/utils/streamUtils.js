import { Mesh } from 'three/src/objects/Mesh.js';
import { AlvaAR } from './vendor/alva_ar.js';
import { Camera, resize2cover } from './utils';
import { ARCamView } from './view';
import { state } from './state';
import { TextureLoader } from 'three/src/loaders/TextureLoader.js';
import { MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry, } from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/Addons.js';
export const startStreams = (stream) => {
    if (stream) {
        stream.getTracks().forEach((track) => {
            track.stop();
        });
    }
    Camera.Initialize(state.constraints)
        .then((camera) => gotStream(camera))
        .catch(handleError);
};
export const stopStreams = () => {
    if (state.stream) {
        state.stream.getTracks().forEach((track) => {
            track.stop();
        });
    }
    state.videoInited = false;
    state.$view.remove();
    state.$canvas.remove();
    state.$video.remove();
    state.alva.reset();
    state.alvaView.reset();
    state.ctx = null;
    state.$video = null;
    state.stream = null;
    state.alva = null;
    state.alvaView = null;
};
const gotStream = async (media) => {
    state.stream = media.el.srcObject; // make stream available to state
    state.$video = media.el;
    console.log('stream', state.stream);
    await initVideo();
    state.ctx = state.$canvas.getContext('2d', {
        alpha: false,
        desynchronized: true,
    });
    state.alva = await AlvaAR.Initialize(state.$canvas.width, state.$canvas.height);
    state.alvaView = new ARCamView(state.$view, state.$canvas.width, state.$canvas.height);
    // Add objects to scene
    // Create a texture loader
    const textureLoader = new TextureLoader();
    // Load a texture
    textureLoader.load(new URL('https://pub-dc411ce328ca438c8229e569659d6ebb.r2.dev/ad.jpg').href, (texture) => {
        // This function is called when the texture has been loaded successfully
        // Create a plane geometry to represent the image
        const geometry = new PlaneGeometry(10, 10); // Adjust size as needed
        // Create a material using the loaded texture
        const material = new MeshBasicMaterial({ map: texture });
        // Create a mesh using the geometry and material
        const imageObject = new Mesh(geometry, material);
        // Add the mesh to your scene
        imageObject.visible = false;
        imageObject.userData = {
            ...imageObject.userData,
            ad: true,
            destinationFeatureId: state.destinationFeatureId,
        };
        state.alvaView.addObject(imageObject, 0, 0, -15, 1);
    });
    // Create a font loader
    const fontLoader = new FontLoader();
    // Load a font
    fontLoader.load(new URL('https://pub-dc411ce328ca438c8229e569659d6ebb.r2.dev/helvetiker_regular.typeface.json')
        .href, (font) => {
        // Create text geometry
        const textGeometry = new TextGeometry('Take me there', {
            font,
            size: 1,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.075,
            bevelSize: 0.01,
        });
        // Create a material for the text
        const textMaterial = new MeshPhongMaterial({
            color: 0xffffff,
            shininess: 10,
        }); // White color
        // Create a mesh using the text geometry and material
        const textObject = new Mesh(textGeometry, textMaterial);
        // Add the mesh to your scene
        textObject.visible = false;
        textObject.userData = {
            ...textObject.userData,
            ad: true,
            destinationFeatureId: state.destinationFeatureId,
        };
        state.alvaView.addObject(textObject, -4.5, -5.5, -14, 1);
    });
    /*const object = new Mesh(
        new IcosahedronGeometry(1, 0),
        new MeshNormalMaterial({ flatShading: true })
    );
    object.visible = false;
    state.alvaView.addObject(object, 0, 0, -10, 1);*/
    state.$container.appendChild(state.$canvas);
    state.$container.appendChild(state.$view);
    /*document.body.addEventListener('click', (e) => {
        state.alva.reset();
    }, false);*/
};
export const initVideo = async () => {
    if (!state.$video) {
        return;
    }
    state.size = resize2cover(state.$video.videoWidth, state.$video.videoHeight, state.$container.clientWidth, state.$container.clientHeight);
    if (!state.size) {
        return;
    }
    state.$canvas.width = state.$container.clientWidth;
    state.$canvas.height = state.$container.clientHeight;
    state.$video.style.width = state.size.width + 'px';
    state.$video.style.height = state.size.height + 'px';
    state.videoInited = true;
    console.log('video init done');
};
const handleError = (error) => {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
};
