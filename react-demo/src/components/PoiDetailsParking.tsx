import { useEffect } from 'react';
import { t } from 'i18next';
import Feature from 'proximiio-js-library/lib/models/feature';
import { cn } from '@/lib/utils';

import useMapStore from '@/store/mapStore';

interface PoiDetailsParkingProps {
	closestParkingFeature: Feature;
	showMore: boolean;
	onSet: (feature: Feature) => void;
}

function PoiDetailsParking({
	closestParkingFeature,
	showMore,
	onSet,
}: PoiDetailsParkingProps) {
	const map = useMapStore((state) => state.map);
	const currentLanguage = useMapStore((state) => state.currentLang);
	const haveRouteDetails = useMapStore((state) => state.haveRouteDetails);
	const parkingAmenityId = import.meta.env.VITE_WAYFINDING_PARKING_AMENITY_ID;
	const poi = useMapStore((state) => state.routeFinish);

	useEffect(() => {
		const getClosestParking = () => {
			if (poi.properties) {
				const closestParkingFeature = map.getClosestFeature(
					parkingAmenityId,
					poi
				) as Feature;
				if (closestParkingFeature) {
					closestParkingFeature.properties.title =
						closestParkingFeature.properties.title_i18n &&
						closestParkingFeature.properties.title_i18n[currentLanguage]
							? closestParkingFeature.properties.title_i18n[currentLanguage]
							: closestParkingFeature.properties.title;
					onSet(closestParkingFeature);
				}
			}
		};

		getClosestParking();
	}, [currentLanguage, map, onSet, parkingAmenityId, poi]);

	const locateParkingHandler = () => {
		map.centerToFeature(closestParkingFeature.id);
	};

	return (
		<>
			{closestParkingFeature && closestParkingFeature?.properties && (
				<p
					className={cn(
						'text-sm cursor-pointer text-primary hover:text-accent lg:text-md',
						haveRouteDetails && 'lg:block',
						haveRouteDetails && !showMore && 'hidden',
						showMore && 'mt-4'
					)}
					onClick={locateParkingHandler}
				>
					<strong>{t('closest-parking')}:</strong>{' '}
					{closestParkingFeature.properties.title}
				</p>
			)}
		</>
	);
}

export default PoiDetailsParking;
