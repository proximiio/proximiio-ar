import { useCallback } from 'react';
import useMapStore from '@/store/mapStore';

export default function UseKiosk() {
	const map = useMapStore((state) => state.map);

	const resetViewStore = useMapStore((state) => state.resetView);
	const locateMe = useMapStore((state) => state.locateMe);
	const setAppSession = useMapStore((state) => state.setAppSession);

	// handle reset to default view
	const resetView = useCallback(() => {
		resetViewStore();
		locateMe();
		if (Object.keys(map).length > 0) {
			map.refetch();
			setAppSession();
		}
	}, [map, resetViewStore, locateMe, setAppSession]);

	// idleTime function handle timeouts to reset to default view
	const idleTime = useCallback(() => {
		let t: ReturnType<typeof setTimeout>;

		// set timer and call reset view method on timeout
		const resetTimer = () => {
			clearTimeout(t);
			t = setTimeout(resetView, 1 * 6000); // 1 minute
		};

		window.onload = resetTimer;
		window.onmousemove = resetTimer;
		window.onmousedown = resetTimer; // catches touchscreen presses as well
		window.ontouchstart = resetTimer; // catches touchscreen swipes as well
		window.ontouchmove = resetTimer; // required by some devices
		window.onclick = resetTimer; // catches touchpad clicks as well
		window.onkeydown = resetTimer;
		window.addEventListener('scroll', resetTimer, true); // improved; see comments*/
	}, [resetView]);

	return [idleTime];
}
