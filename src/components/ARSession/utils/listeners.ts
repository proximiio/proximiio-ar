import { degToRad } from 'three/src/math/MathUtils.js';
import { state } from './state';
import { initVideo } from './streamUtils';

export const initializeListeners = () => {
	window.addEventListener('deviceorientation', handleOrientation, true);
	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener('focus', onWindowFocus, false);
	window.addEventListener('blur', onWindowBlur, false);
};

export const stopListeners = () => {
	window.removeEventListener('deviceorientation', handleOrientation, true);
	window.removeEventListener('resize', onWindowResize, false);
	window.removeEventListener('focus', onWindowFocus, false);
	window.removeEventListener('blur', onWindowBlur, false);
};


const handleOrientation = (event: DeviceOrientationEvent) => {
	state.rotateDegrees = event.alpha ? event.alpha : 0; // alpha: rotation around z-axis
	state.frontToBack = event.beta ? event.beta : 0; // beta: front back motion
	state.leftToRight = event.gamma ? event.gamma : 0; // gamma: left to right

	const alpha = state.rotateDegrees ? degToRad(state.rotateDegrees) : 0; // Z
	const beta = state.frontToBack ? degToRad(state.frontToBack) : 0; // X'
	const gamma = state.leftToRight ? degToRad(state.leftToRight) : 0; // Y''

	state.euler.set(beta, alpha, -gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us

	state.q3.setFromEuler(state.euler); // orient the device
	state.q3.multiply(state.q1); // camera looks out the back of the device, not the top

	state.gyroR.makeRotationFromQuaternion(state.q3);

	state.S.copy(state.gyroR);

	state.S.elements[0 + 0 * 4] = -state.gyroR.elements[0 + 0 * 4];
	state.S.elements[1 + 0 * 4] = state.gyroR.elements[1 + 0 * 4];
	state.S.elements[2 + 0 * 4] = -state.gyroR.elements[2 + 0 * 4];

	state.S.elements[0 + 1 * 4] = -state.gyroR.elements[0 + 1 * 4];
	state.S.elements[1 + 1 * 4] = state.gyroR.elements[1 + 1 * 4];
	state.S.elements[2 + 1 * 4] = -state.gyroR.elements[2 + 1 * 4];

	state.S.elements[0 + 2 * 4] = -state.gyroR.elements[0 + 2 * 4];
	state.S.elements[1 + 2 * 4] = state.gyroR.elements[1 + 2 * 4];
	state.S.elements[2 + 2 * 4] = -state.gyroR.elements[2 + 2 * 4];

	state.gyroR.copy(state.S);
};

const onWindowResize = () => {
	console.log('window resize');
	initVideo();
};

const onWindowFocus = () => {
	console.log('window focus');
	// if (typeof icvReset !== 'undefined') icvReset();
	// startStreams();
};

const onWindowBlur = () => {
	console.log('window blur');
};
