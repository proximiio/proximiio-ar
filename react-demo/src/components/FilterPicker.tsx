import React, { useState } from 'react';
import { t } from 'i18next';
import { AnimatePresence, motion } from 'framer-motion';
import Proximiio from 'proximiio-js-library';
import Feature from 'proximiio-js-library/lib/models/feature';
import {
	osName,
	browserName,
	mobileModel,
	mobileVendor,
	deviceType,
} from 'react-device-detect';
import { HiOutlineEllipsisHorizontal } from 'react-icons/hi2';
import { FilterItemModel } from '@/models/filterItem.model';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

import useMapStore from '@/store/mapStore';

interface FilterPickerProps {
	heading: string;
	color?: string;
	items: FilterItemModel[];
}

function FilterPicker({ heading, color, items }: FilterPickerProps) {
	const kioskMode = useMapStore((state) => state.kioskMode);
	const gpsMode = useMapStore((state) => state.gpsMode);
	const map = useMapStore((state) => state.map);
	const activeKiosk = useMapStore((state) => state.activeKiosk);
	const currentLang = useMapStore((state) => state.currentLang);
	const appSession = useMapStore((state) => state.appSession);
	const setActiveFilter = useMapStore((state) => state.setActiveFilter);
	const setRouteStart = useMapStore((state) => state.setRouteStart);
	const setRouteFinish = useMapStore((state) => state.setRouteFinish);

	const defaultItemsLimit = +import.meta.env
		.VITE_WAYFINDING_CATEGORY_ITEMS_LIMIT;
	const [itemsLimit, setItemsLimit] = useState(defaultItemsLimit);
	const [showMore, setShowMore] = useState(false);

	const moreThanLimit = items.length > itemsLimit;

	const filterClickHandler = (item: FilterItemModel) => {
		if (Object.keys(map).length > 0) {
			if ((!gpsMode && !kioskMode) || item.type !== 'closest') {
				setActiveFilter(item);
			} else {
				const closestFeature = map.getClosestFeature(
					item.id as string
				) as Feature;
				setRouteStart('kiosk');
				setRouteFinish(closestFeature);
			}

			//save amenity_category log
			const userData = {
				osName,
				browserName,
				mobileModel,
				mobileVendor,
				deviceType,
			};
			new Proximiio.SelectLogger({
				clickedElementId: Array.isArray(item.id)
					? item.id.join('_')
					: item.id
					? item.id
					: 'undefined',
				clickedElementType: 'amenity_category',
				clickedElementTitle: item.title,
				kioskId: activeKiosk?.id ? activeKiosk?.id : activeKiosk?.name,
				metadata: userData,
				source: 'manual',
				language: currentLang,
				session: appSession,
			});
		}
	};

	const toggleHandler = () => {
		setShowMore(true);
		setItemsLimit(10000);
	};

	return (
		<>
			<AnimatePresence>
				<motion.h1
					initial={{ scale: 2, opacity: 0, filter: 'blur(100px)' }}
					animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
					transition={{ duration: 0.2 }}
					className={cn(
						`text-md font-semibold mb-1 sm:text-xl sm:mb-2 text-center sm:text-left`,
						color === 'primary' && 'text-primary',
						color === 'secondary' && 'text-secondary'
					)}
					key='heading'
				>
					{heading}
				</motion.h1>
				<ul className='flex flex-wrap justify-center grid-cols-5 gap-2 mb-2 sm:mb-6 sm:grid sm:justify-normal'>
					{items
						.slice(0, moreThanLimit ? itemsLimit - 1 : itemsLimit)
						.map((item, idx) => (
							<motion.li
								initial={{ scale: 0, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{
									type: 'spring',
									stiffness: 260,
									damping: 20,
									delay: 0.1 + (showMore ? idx - defaultItemsLimit : idx) / 10,
								}}
								key={idx}
								className='w-12 text-center sm:w-16'
							>
								<Button
									size='icon'
									variant={color === 'primary' ? 'default' : 'secondary'}
									className='w-12 h-12 text-lg sm:w-16 sm:h-16 sm:text-2xl'
									onClick={() => filterClickHandler(item)}
								>
									{item.icon && React.createElement(item.icon)}
									{item.iconImage && (
										<img
											src={item.iconImage}
											alt={t(item.title)}
											className='w-1/2'
										/>
									)}
								</Button>
								<p className='mt-1 overflow-hidden text-xs text-ellipsis whitespace-nowrap sm:whitespace-normal'>
									{t(item.title)}
								</p>
							</motion.li>
						))}
					{moreThanLimit && (
						<motion.li
							initial={{ scale: 0, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{
								type: 'spring',
								stiffness: 260,
								damping: 20,
								delay: 0.1 + itemsLimit / 10,
							}}
							className='w-12 text-center sm:w-16'
						>
							<Button
								size='icon'
								variant={color === 'primary' ? 'default' : 'secondary'}
								className='w-12 h-12 text-lg sm:w-16 sm:h-16 sm:text-2xl'
								onClick={toggleHandler}
							>
								<HiOutlineEllipsisHorizontal />
							</Button>
							<p className='mt-1 overflow-hidden text-xs text-ellipsis whitespace-nowrap sm:whitespace-normal'>
								{t('more')}
							</p>
						</motion.li>
					)}
				</ul>
			</AnimatePresence>
		</>
	);
}

export default FilterPicker;
