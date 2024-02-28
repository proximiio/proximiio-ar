import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { TfiAngleDown, TfiAngleUp } from 'react-icons/tfi';
import { cn } from '@/lib/utils';

import useMapStore from '@/store/mapStore';

const defaultDetails =
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

function PoiDetailsDescription({ showMore }: { showMore: boolean }) {
	const [details, setDetails] = useState(defaultDetails);
	const [toggleDetails, setToggleDetails] = useState(false);
	const [limit, setLimit] = useState(200);
	const poi = useMapStore((state) => state.routeFinish);

	const currentLanguage = useMapStore((state) => state.currentLang);

	useEffect(() => {
		if (poi?.properties?.description_i18n) {
			setDetails(
				poi.properties.description_i18n[currentLanguage]
					? poi.properties.description_i18n[currentLanguage]
					: poi.properties.description_i18n.en
			);
			return;
		}
		if (poi?.properties?.metadata?.description) {
			setDetails(
				poi.properties.metadata.description[currentLanguage]
					? poi.properties.metadata.description[currentLanguage]
					: poi.properties.metadata.description.en
			);
			return;
		}
	}, [
		poi?.properties?.description_i18n,
		poi?.properties?.metadata?.description,
		currentLanguage,
	]);

	return (
		<>
			{details && (
				<div className={cn('mb-4 lg:block', !showMore && 'hidden')}>
					<p className='text-sm'>
						{details.slice(0, limit)} {details.length > limit ? '...' : ''}
					</p>
					{details.length > limit && (
						<span
							onClick={() => {
								setLimit(details.length);
								setToggleDetails(true);
							}}
							className='text-sm font-semibold cursor-pointer hover:text-primary'
						>
							{t('showMore')}
							<TfiAngleDown className='inline-flex ml-1 text-xs' />
						</span>
					)}
					{toggleDetails && (
						<span
							onClick={() => {
								setLimit(200);
								setToggleDetails(false);
							}}
							className='text-sm font-semibold cursor-pointer hover:text-primary'
						>
							{t('showLess')}
							<TfiAngleUp className='inline-flex ml-1 text-xs' />
						</span>
					)}
				</div>
			)}
		</>
	);
}

export default PoiDetailsDescription;
