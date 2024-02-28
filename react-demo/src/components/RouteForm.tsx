import { useState } from 'react';
import { motion } from 'framer-motion';
import { t } from 'i18next';
import { PiPersonSimpleWalk } from 'react-icons/pi';
import Feature from 'proximiio-js-library/lib/models/feature';
import { FilterItemModel } from '@/models/filterItem.model';
import { Button } from './ui/button';
import PoiSelect from './PoiSelect';
import ClosestAmenitySelect from './ClosestAmenitySelect';

import useMapStore from '@/store/mapStore';

function RouteForm() {
	const features = useMapStore((state) => state.features);
	const activeFilter = useMapStore((state) => state.activeFilter);
	const routeStart = useMapStore((state) => state.routeStart);
	const routeFinish = useMapStore((state) => state.routeFinish);
	const map = useMapStore((state) => state.map);
	const showCustomRoutePicker = useMapStore(
		(state) => state.showCustomRoutePicker
	);
	const [startFeature, setStartFeature] = useState(routeStart);
	const [finishFeature, setFinishFeature] = useState(routeFinish);

	const setRouteStart = useMapStore((state) => state.setRouteStart);
	const setRouteFinish = useMapStore((state) => state.setRouteFinish);
	const setActiveFilter = useMapStore((state) => state.setActiveFilter);
	const setShowCustomRoutePicker = useMapStore(
		(state) => state.setShowCustomRoutePicker
	);

	const startSelectHandler = (featureId: string) => {
		setStartFeature(features.find((item) => item.id === featureId)!);
	};

	const finishSelectHandler = (featureId: string) => {
		setFinishFeature(features.find((item) => item.id === featureId)!);
	};

	const clickHandler = () => {
		if (startFeature !== 'kiosk' && startFeature?.id && finishFeature?.id) {
			console.log('should find regular route');
			setRouteStart(startFeature);
			setRouteFinish(finishFeature);
			setShowCustomRoutePicker(false);
			return;
		}
		if (startFeature !== 'kiosk' && startFeature?.id && activeFilter?.id) {
			console.log('should find closest amenity route');
			const closestFeature = map.getClosestFeature(
				activeFilter.id as string,
				startFeature
			) as Feature;
			setRouteStart(startFeature);
			setRouteFinish(closestFeature);
			setActiveFilter({} as FilterItemModel);
			return;
		}
	};

	const isButtonDisabled = () => {
		const startFeatureNotSelected =
			startFeature !== 'kiosk' && !startFeature?.id;
		const finishFeatureNotSelected = !finishFeature?.id;
		const noActiveFilter = !activeFilter?.id;

		if (startFeatureNotSelected) {
			return true;
		}

		if (finishFeatureNotSelected && noActiveFilter) {
			return true;
		}

		return false;
	};

	return (
		<>
			<motion.div
				key='list'
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0 }}
				transition={{ duration: 0.2 }}
				className='fixed inset-x-0 bottom-0 z-10 p-5 border-2 rounded-lg lg:pt-12 lg:absolute bg-white/80 lg:top-20 lg:left-5 lg:inset-x-auto lg:bottom-auto'
			>
				<h2 className='text-lg font-semibold lg:mb-4 lg:mt-4 text-primary'>
					{t(activeFilter.title)}
				</h2>
				<div className='flex items-center gap-1 lg:block'>
					{startFeature !== 'kiosk' && (
						<PoiSelect
							selectedPoi={startFeature}
							onSelect={startSelectHandler}
							placeholder={t('startingPoint')}
						/>
					)}
					{showCustomRoutePicker && (
						<PoiSelect
							selectedPoi={finishFeature}
							onSelect={finishSelectHandler}
							placeholder={t('destination')}
						/>
					)}
					{activeFilter?.type === 'closest' && <ClosestAmenitySelect />}
					<Button
						className='flex w-full'
						disabled={isButtonDisabled()}
						onClick={clickHandler}
					>
						<PiPersonSimpleWalk className='mr-2 text-2xl' />
						<span className='hidden sm:inline'>{t('takeMeThere')}</span>
					</Button>
				</div>
			</motion.div>
		</>
	);
}

export default RouteForm;
