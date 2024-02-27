import { ARButton, ARSession, InjectCSS } from 'proximiio-ar';

const css = `
button {
  cursor: pointer;
  position: absolute;
  width: 150px;
  left: calc(50% - 75px);
  bottom: 20px;
  padding: 12px 6px;
  border: 1px solid #fff;
  border-radius: 4px;
  background: rgba(0,0,0,0.9);
  color: #fff;
  text-align: center;
  opacity: 0.5;
  outline: none;
  z-index: 999;
}
button:hover {
  opacity: 1;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}
button.active {
  background: rgba(254,67,101, .5);

  &:hover {
    background: rgba(254,67,101, 1);
  }
}
`;

InjectCSS({ id: 'ar-button', css });

ARButton.createButton({
	immersalToken: import.meta.env.VITE_IMMERSAL_TOKEN,
	immersalMapId: import.meta.env.VITE_IMMERAL_MAP,
	destinationFeatureId:
		'44010f6f-9963-4433-ad86-40b89b829c41:d3c99733-f451-4a43-a45a-2ce2edfb7817',
	startText: 'ENTER AR',
	stopText: 'EXIT AR',
});

const session = new ARSession();
session.onStart(() => {
	console.log('Session has started');
});
session.onStop((destinationFeatureId) => {
	console.log('Session has stopped', destinationFeatureId);
});
