import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { cn } from '@/lib/utils';

import useMapStore from '@/store/mapStore';

function PoiDetailsLink({ showMore }: { showMore: boolean }) {
	const [linkUrl, setLinkUrl] = useState('');
	const poi = useMapStore((state) => state.routeFinish);

	useEffect(() => {
		const getUrl = () => {
			if (poi.properties) {
				const url =
					typeof poi.properties.url === 'undefined'
						? typeof poi.properties.metadata !== 'undefined'
							? poi.properties.metadata.url
							: 'yolo'
						: poi.properties.url;
				if (url) {
					let protocol = url.startsWith('http://') ? 1 : 0;
					if (protocol === 0) protocol = url.startsWith('https://') ? 2 : 0;
					setLinkUrl(protocol === 0 ? `http://${url}` : url);
					return;
				}
				setLinkUrl(url);
			}
		};

		getUrl();
	}, [poi.properties]);

	return (
		<>
			{linkUrl && (
				<p className={cn('mb-4 text-sm lg:block', !showMore && 'hidden')}>
					{t('link')}:{' '}
					<a href={linkUrl} target='_blank' className='hover:text-primary'>
						{linkUrl}
					</a>
				</p>
			)}
		</>
	);
}

export default PoiDetailsLink;
