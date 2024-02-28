/* eslint-disable no-mixed-spaces-and-tabs */
import { useState } from 'react';
import { motion } from 'framer-motion';
import Feature from 'proximiio-js-library/lib/models/feature';
import { GoChevronUp, GoChevronDown } from 'react-icons/go';
import { cn } from '@/lib/utils';
import PoiDetailsImage from './PoiDetailsImage';
import PoiDetailsHeading from './PoiDetailsHeading';
import PoiDetailsDescription from './PoiDetailsDescription';
import PoiDetailsLink from './PoiDetailsLink';
import PoiDetailsParking from './PoiDetailsParking';
import PoiDetailsRoutes from './PoiDetailsRoutes';
import PoiDetailsDistance from './PoiDetailsDistance';
import PoiDetailsRouteToggle from './PoiDetailsRouteToggle';
import PoiDetailsSteps from './PoiDetailsSteps';

function PoiDetails() {
	const [closestParkingFeature, setClosestParkingFeature] = useState(
		{} as Feature
	);
	const [showMore, setShowMore] = useState(false);

	return (
		<>
			<motion.div
				key='details'
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0 }}
				transition={{ duration: 0.2 }}
				className={cn(
					'fixed inset-x-0 bottom-0 z-10 overflow-x-hidden overflow-y-auto bg-white rounded-lg shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] lg:shadow-xl lg:absolute lg:top-20 lg:left-5 lg:max-w-md lg:bottom-auto lg:max-h-[90%]',
					showMore && 'max-h-[70%]'
				)}
			>
				<div
					className='absolute z-20 block w-12 h-12 text-5xl cursor-pointer left-[calc(50%-24px)] text-primary hover:text-accent lg:hidden'
					onClick={() => setShowMore(!showMore)}
				>
					{showMore && <GoChevronDown />} {!showMore && <GoChevronUp />}
				</div>
				<PoiDetailsImage showMore={showMore} />
				<div className='pt-10 px-6 py-5 bg-white rounded-tr-2xl relative lg:top-[-20px] lg:px-10'>
					<PoiDetailsHeading showMore={showMore} />
					<PoiDetailsDescription showMore={showMore} />
					<PoiDetailsLink showMore={showMore} />
					<PoiDetailsDistance showMore={showMore} />
					<PoiDetailsRouteToggle showMore={showMore} />
					<PoiDetailsSteps />
					<PoiDetailsParking
						closestParkingFeature={closestParkingFeature}
						onSet={setClosestParkingFeature}
						showMore={showMore}
					/>
					<PoiDetailsRoutes
						closestParkingFeature={closestParkingFeature}
						showMore={showMore}
					/>
				</div>
			</motion.div>
		</>
	);
}
export default PoiDetails;
