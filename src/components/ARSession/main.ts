import { startStreams, stopStreams } from './utils/streamUtils';
import { initializeListeners, stopListeners } from './utils/listeners';
import {
	InjectCSS,
	browserHasImmersiveArCompatibility,
	displayUnsupportedBrowserMessage,
} from './utils/domUtils';
import { state } from './utils/state';
import { initLocalizeWorker } from './utils/localize';

const css = `
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	html,
	body {
		font-family: sans-serif;
		overflow: hidden;
		position: relative;
		width: 100%;
		height: 100%;
		text-align: center;
	}

	#container {
		position: relative;
		width: 100%;
		height: 100%;
		display: block;
		overflow: hidden;
		line-height: 0;
		z-index: 1;
	}

	#container > * {
		position: absolute;
		display: block;
		user-select: none;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		animation: fadeIn 1.2s;
		z-index: 1;
	}

	canvas {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}

	#container > video {
		object-fit: cover;
		object-position: 50% 50%;
	}

	@media screen and (max-device-width: 480px) and (orientation: landscape) {
		#container {
				display: none;
		}

		body::before {
				content: "Rotate device to portrait mode.";
				color: white;
		}
	}

	@media screen and (max-device-width: 480px) and (orientation: portrait) {
		#container {
				display: block;
		}

		body::before {
				content: none;
		}
	}
`;

export interface Options {
	immersalToken?: string;
	immersalMapId?: number;
	destinationFeatureId?: string;
}

class ARSession {
	private static onStopListeners: ((destinationFeatureId?: string) => void)[] =
		[];
	private static onStartListeners: (() => void)[] = [];

	static async start(options: Options = {}) {
		if (!options.immersalToken) {
			console.error('No Immersal token provided');
			return;
		}
		if (!options.immersalMapId) {
			console.error('No Immersal map id provided');
			return;
		}
		state.immersalToken = options.immersalToken;
		state.immersalMapId = options.immersalMapId;
		state.destinationFeatureId = options.destinationFeatureId;

		// Check if browser supports WebXR with "immersive-ar"
		const immersiveArSupported = await browserHasImmersiveArCompatibility();

		const initializeXRApp = () => {
			console.log('Initializing XR Session');
			if (!document.getElementById('ar-session-css')) {
				InjectCSS({ id: 'ar-session-css', css });
			}

			const $container = document.createElement('div');
			$container.id = 'container';
			state.$container = $container;
			document.body.appendChild($container);

			initLocalizeWorker();
			initializeListeners();
			startStreams();

			// Emit onStart event
			this.onStartListeners.forEach((listener) => listener());
		};

		// Initialize app if supported
		immersiveArSupported
			? initializeXRApp()
			: displayUnsupportedBrowserMessage();
	}

	static async stop(destinationFeatureId?: string) {
		console.log('Stopping XR Session');
		const $container = document.getElementById('container');
		$container.remove();
		document.getElementById('ar-session-css').remove();

		stopListeners();
		stopStreams();

		// Emit onStop event
		this.onStopListeners.forEach((listener) => listener(destinationFeatureId));
	}

	// Subscribe to onStart event
	onStart(callback: () => void) {
		ARSession.onStartListeners.push(callback);
	}

	// Subscribe to onStop event
	onStop(callback: (destinationFeatureId?: string) => void) {
		ARSession.onStopListeners.push(callback);
	}
}

export { ARSession };
