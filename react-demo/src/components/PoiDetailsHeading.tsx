import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '@/lib/utils';

import useMapStore from '@/store/mapStore';

function PoiDetailsHeading({ showMore }: { showMore: boolean }) {
	const [qrCodeUrl, setQrCodeUrl] = useState('');

	const currentLanguage = useMapStore((state) => state.currentLang);
	const poi = useMapStore((state) => state.routeFinish);
	const haveRouteDetails = useMapStore((state) => state.haveRouteDetails);
	const routeStart = useMapStore((state) => state.routeStart);
	const routeFinish = useMapStore((state) => state.routeFinish);

	const getOpenHours = () => {
		const d = new Date();
		const weekDay = d.getDay();

		if (poi.properties) {
			if (poi.properties.workingHours && poi.properties.workingHours[weekDay]) {
				return `${poi.properties.workingHours[weekDay][0]} - ${poi.properties.workingHours[weekDay][1]}`;
			} else if (
				poi.properties.metadata &&
				poi.properties.metadata.openHours &&
				poi.properties.metadata.openHours[weekDay].en
			) {
				return poi.properties.metadata.openHours[weekDay][currentLanguage]
					? poi.properties.metadata.openHours[weekDay][currentLanguage]
					: poi.properties.metadata.openHours[weekDay].en;
			} else {
				return t('noOpenHours');
			}
		}
	};

	useEffect(() => {
		const url = new URL(window.location.href);
		const urlParams = url.searchParams;
		urlParams.set('qrCode', 'true');
		if (haveRouteDetails) {
			if (!routeStart && routeFinish) {
				urlParams.set('destinationFeature', routeFinish.properties.id);
			}
			if (routeFinish && routeStart) {
				urlParams.set('destinationFeature', routeFinish.properties.id);
				if (routeStart !== 'kiosk' && routeStart.properties) {
					urlParams.set('startFeature', routeStart.properties.id);
				}
			}
		}
		setQrCodeUrl(url.href);
	}, [haveRouteDetails, routeFinish, routeStart]);

	return (
		<>
			<h1 className='text-2xl font-semibold text-primary'>
				{poi.properties?.title}
			</h1>
			{haveRouteDetails && (
				<div className='items-center justify-center hidden py-4 lg:flex'>
					<QRCodeSVG value={qrCodeUrl} className='shrink-0' size={96} />
					<p className='pl-4 text-lg font-semibold text-primary'>
						{t('scan-qr-code')}
					</p>
				</div>
			)}
			<h3
				className={cn('text-sm text-primary lg:block', !showMore && 'hidden')}
			>
				{getOpenHours()}
			</h3>
			<h3 className='mb-2 text-sm font-semibold lg:mb-8'>
				{t('floor')}:{' '}
				{poi.properties?._dynamic?.floorName
					? poi.properties?._dynamic.floorName
					: poi.properties?.level}
			</h3>
		</>
	);
}

export default PoiDetailsHeading;
