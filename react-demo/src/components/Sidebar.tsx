import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useClickAway } from 'react-use';
import { cn } from '@/lib/utils';
import FilterMenu from './FilterMenu';
import PoiList from './PoiList';
import Filters from './Filters';
import RouteForm from './RouteForm';
import PoiDetails from './PoiDetails';

import useMapStore from '@/store/mapStore';
import InfoBox from './InfoBox';

function Sidebar() {
	const [color, setColor] = useState('#000');
	const ref = useRef(null);

	const [isOpen, setOpen] = useMapStore((state) => [
		state.sidebarIsOpen,
		state.setSidebarIsOpen,
	]);
	const activeFilter = useMapStore((state) => state.activeFilter);
	const routeFinish = useMapStore((state) => state.routeFinish);
	const kioskMode = useMapStore((state) => state.kioskMode);
	const gpsMode = useMapStore((state) => state.gpsMode);
	const showCustomRoutePicker = useMapStore(
		(state) => state.showCustomRoutePicker
	);

	const resetView = useMapStore((state) => state.resetView);

	useClickAway(ref, () => {
		if (isOpen && routeFinish?.id) {
			return;
		}
		if (isOpen && activeFilter?.id) {
			return;
		}
		if (!isOpen) {
			return;
		}
		onCloseHandler();
	});

	// open sidebar if route finish is set by search/polygon click/url params
	useEffect(() => {
		if (routeFinish?.id) {
			setOpen(true);
			setColor('#e11d48');
		}
		if (!isOpen) {
			setColor('#000');
		}
	}, [routeFinish, setOpen, isOpen]);

	const onCloseHandler = () => {
		console.log('close handler');
		setOpen(false);
		setColor('#000');
		resetView();
	};

	return (
		<div ref={ref}>
			<FilterMenu
				isOpen={isOpen}
				setOpen={setOpen}
				color={color}
				setColor={setColor}
				onClose={onCloseHandler}
				className={cn(
					routeFinish?.id && 'bg-white border-2 lg:border-0 lg:m-3 lg:p-1 left-2 top-5 sm:left-5 sm:top-5',
					(activeFilter?.type === 'list' ||
						activeFilter?.type === 'closest' ||
						activeFilter?.type === 'info' ||
						showCustomRoutePicker) &&
						'bg-white shadow-md lg:shadow-none lg:bg-transparent left-2 top-5 sm:left-5 sm:top-5'
				)}
			/>
			<AnimatePresence>
				{isOpen &&
					Object.keys(activeFilter).length === 0 &&
					Object.keys(routeFinish).length === 0 && <Filters key='1' />}
				{isOpen && activeFilter?.type === 'list' && <PoiList key='2' />}
				{isOpen &&
					((activeFilter?.type === 'closest' && !kioskMode && !gpsMode) ||
						showCustomRoutePicker) && <RouteForm key='3' />}
				{isOpen && activeFilter?.type === 'info' && <InfoBox key='4' />}
				{isOpen && routeFinish?.id && !showCustomRoutePicker && (
					<PoiDetails key='5' />
				)}
			</AnimatePresence>
		</div>
	);
}

export default Sidebar;
