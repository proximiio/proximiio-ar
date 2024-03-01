import { ARSession } from '../ARSession/main';
import { browserHasImmersiveArCompatibility } from '../ARSession/utils/domUtils';
import { state } from '../ARSession/utils/state';
const xr = navigator?.xr;
class ARButton {
    static async createButton(options = {}) {
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
        const button = document.createElement('button');
        function showStartAR( /*device*/) {
            console.log('showStartAR');
            let currentSession = null;
            const session = new ARSession();
            session.onStart(onSessionStarted);
            session.onStop(onSessionEnded);
            function onSessionStarted() {
                button.textContent = options.stopText ? options.stopText : 'STOP AR';
                button.classList.add('active');
            }
            function onSessionEnded() {
                // console.log('onSessionEnded', destinationFeatureId);
                button.textContent = options.startText ? options.startText : 'START AR';
                // buttonSessionEnd(destinationFeatureId);
                button.classList.remove('active');
            }
            button.style.display = '';
            button.style.cursor = 'pointer';
            button.textContent = options.startText ? options.startText : 'START AR';
            button.onclick = () => {
                if (currentSession === null) {
                    currentSession = ARSession.start({
                        immersalToken: options.immersalToken,
                        immersalMapId: options.immersalMapId,
                        destinationFeatureId: options.destinationFeatureId,
                    });
                }
                else {
                    ARSession.stop();
                    currentSession = null;
                }
            };
            if (options.parentElementId) {
                const parentElement = document.getElementById(options.parentElementId);
                parentElement.appendChild(button);
            }
            else {
                document.body.appendChild(button);
            }
        }
        function disableButton() {
            button.style.display = '';
            button.style.cursor = 'auto';
            button.onmouseenter = null;
            button.onmouseleave = null;
            button.onclick = null;
        }
        function showARNotSupported() {
            disableButton();
            button.textContent = 'AR NOT SUPPORTED';
        }
        function stylizeElement(element) {
            element.style.position = 'absolute';
            element.style.bottom = '20px';
            element.style.padding = '12px 6px';
            element.style.border = '1px solid #fff';
            element.style.borderRadius = '4px';
            element.style.background = 'rgba(0,0,0,0.1)';
            element.style.color = '#fff';
            element.style.font = 'normal 13px sans-serif';
            element.style.textAlign = 'center';
            element.style.opacity = '0.5';
            element.style.outline = 'none';
            element.style.zIndex = '999';
        }
        // Check if browser supports WebXR with "immersive-ar"
        const immersiveArSupported = await browserHasImmersiveArCompatibility();
        if (xr) {
            button.id = 'ARButton';
            button.style.display = 'none';
            // stylizeElement(button);
            immersiveArSupported ? showStartAR() : showARNotSupported();
            return button;
        }
        else {
            const message = document.createElement('a');
            if (window.isSecureContext === false) {
                message.href = document.location.href.replace(/^http:/, 'https:');
                message.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message
            }
            else {
                message.href = 'https://immersiveweb.dev/';
                message.innerHTML = 'WEBXR NOT AVAILABLE';
            }
            message.style.left = 'calc(50% - 90px)';
            message.style.width = '180px';
            message.style.textDecoration = 'none';
            stylizeElement(message);
            return message;
        }
    }
}
export { ARButton };
