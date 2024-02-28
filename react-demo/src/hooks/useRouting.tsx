/* eslint-disable no-mixed-spaces-and-tabs */
import { useCallback } from 'react';
import { isPointWithinRadius } from 'geolib';
import { t } from 'i18next';
import { ToastClose } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import useMapStore from '@/store/mapStore';

export default function UseRouting() {
	const map = useMapStore((state) => state.map);
	const accessibleRoute = useMapStore((state) => state.accessibleRoute);
	const gpsMode = useMapStore((state) => state.gpsMode);
	const { toast } = useToast();

	const findRoute = useCallback(
		({
			start,
			finish,
			type,
		}: {
			start?: string;
			finish: string;
			type?: 'closest';
		}) => {
			const defaultWayfindingConfig = {
				avoidElevators: true,
				avoidEscalators: false,
				avoidStaircases: false,
				avoidRamps: false,
				avoidNarrowPaths: false,
				avoidRevolvingDoors: false,
				avoidTicketGates: false,
				avoidBarriers: false,
				avoidHills: false,
			};

			const wayfindingConfig = {
				...defaultWayfindingConfig,
				avoidElevators: accessibleRoute ? false : true,
				avoidRamps: accessibleRoute ? false : true,
				avoidEscalators: accessibleRoute ? true : false,
				avoidStaircases: accessibleRoute ? true : false,
				avoidBarriers: accessibleRoute ? true : false,
				avoidNarrowPaths: accessibleRoute ? true : false,
				avoidRevolvingDoors: accessibleRoute ? true : false,
				avoidTicketGates: accessibleRoute ? true : false,
			};

			if (gpsMode) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const gpsControl: any = map
					.getMapboxInstance()
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					._controls.find((c: any) => c._lastKnownPosition);

				const isInside = gpsControl
					? isPointWithinRadius(
							{
								lat: gpsControl._lastKnownPosition.coords.latitude,
								lng: gpsControl._lastKnownPosition.coords.longitude,
							},
							{
								lat: +import.meta.env.VITE_WAYFINDING_DEFAULT_LOCATION_LATITUDE,
								lng: +import.meta.env
									.VITE_WAYFINDING_DEFAULT_LOCATION_LONGITUDE,
							},
							6000
					  )
					: false;

				if (!isInside) {
					start = import.meta.env.VITE_WAYFINDING_ENTRANCE_FEATURE_ID;
					toast({
						duration: 15000,
						title: t('routeFailedTitle'),
						description: t('routeFailed'),
						variant: 'primary',
						action: (
							<ToastClose aria-label='Close'>
								<span aria-hidden>×</span>
							</ToastClose>
						),
					});
				}
			}

			if (type === 'closest') {
				console.log('closest', finish, start);
				map.findRouteToNearestFeature(
					finish,
					start,
					accessibleRoute,
					wayfindingConfig
				);
				return;
			}
			map.findRouteByIds(finish, start, accessibleRoute, wayfindingConfig);
			console.log('findRoute', { start, finish, wayfindingConfig });
		},
		[accessibleRoute, map, gpsMode, toast]
	);

	return [findRoute];
}
