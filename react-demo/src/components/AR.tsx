import useMapStore from '@/store/mapStore';
import { ARButton, ARSession, InjectCSS } from 'proximiio-ar';
import { useEffect, useState } from 'react';

const css = `
#ARButton {
  cursor: pointer;
  position: absolute;
  width: 120px;
  left: calc(50% - 60px);
  bottom: 20px;
  padding: 12px 3px;
  line-height: 12px;
  font-size: 14px;
  border: 1px solid #fff;
  border-radius: 4px;
  background: rgba(0,0,0,0.9);
  color: #fff;
  text-align: center;
  opacity: 0.5;
  outline: none;
  z-index: 8;
}
#ARButton:hover {
  opacity: 1;
}
#ARButton:focus,
#ARButton:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}
#ARButton.active {
  background: rgba(254,67,101, .5);
  z-index: 999;

  &:hover {
    background: rgba(254,67,101, 1);
  }
}
`;

function AR() {
	const [arBtn, setArBtn] =
		useState<Promise<HTMLButtonElement | HTMLAnchorElement>>();
	const features = useMapStore((state) => state.features);

	const setRouteFinish = useMapStore((state) => state.setRouteFinish);

	useEffect(() => {
		if (!arBtn) {
			const btn = ARButton.createButton({
				immersalToken: import.meta.env.VITE_IMMERSAL_TOKEN,
				immersalMapId: import.meta.env.VITE_IMMERAL_MAP,
				destinationFeatureId:
					'44010f6f-9963-4433-ad86-40b89b829c41:ed594190-29a7-4e23-aac5-7b0e1aa4d8e8',
				startText: 'ENTER AR',
				stopText: 'EXIT AR',
			});
			setArBtn(btn);

			InjectCSS({ id: 'ar-button', css });
		}
	}, [arBtn]);

	useEffect(() => {
		const session = new ARSession();
		session.onStart(() => {
			console.log('Session has started');
		});
		session.onStop((destinationFeatureId) => {
			if (destinationFeatureId) {
				const feature = features.find(
					(feature) => feature.id === destinationFeatureId
				);
				console.log('feature', feature, features);
				if (feature) setRouteFinish(feature);
			}
			console.log('Session has stopped', destinationFeatureId);
		});
	}, [features, setRouteFinish]);

	return <></>;
}

export default AR;
