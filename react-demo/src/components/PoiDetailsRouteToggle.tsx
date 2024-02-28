import { t } from 'i18next';
import { PiPersonSimpleWalk, PiElevator } from 'react-icons/pi';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

import useMapStore from '@/store/mapStore';

function PoiDetailsRouteToggle({ showMore }: { showMore: boolean }) {
	const accessibleRoute = useMapStore((state) => state.accessibleRoute);
	const haveRouteDetails = useMapStore((state) => state.haveRouteDetails);
	const setAccessibleRoute = useMapStore((state) => state.setAccessibleRoute);

	const onValueChangeHandler = (value: string) => {
		setAccessibleRoute(value === 'accessible');
	};

	return (
		<>
			{haveRouteDetails && (
				<ToggleGroup
					type='single'
					value={accessibleRoute ? 'accessible' : 'fastest'}
					onValueChange={onValueChangeHandler}
					className={cn('mb-4 lg:flex', !showMore && 'hidden')}
				>
					<ToggleGroupItem
						value='fastest'
						aria-label='Toggle fastest'
						className='flex flex-col flex-1 h-auto gap-1 p-2 font-light whitespace-normal lg:p-3'
					>
						<PiPersonSimpleWalk className='block text-lg lg:text-4xl' />
						<p>{t('fast-route')}</p>
					</ToggleGroupItem>
					<ToggleGroupItem
						value='accessible'
						aria-label='Toggle accessible'
						className='flex flex-col flex-1 h-auto gap-1 p-2 font-light whitespace-normal lg:p-3'
					>
						<PiElevator className='block text-lg lg:text-4xl' />
						<p>{t('use-elevators')}</p>
					</ToggleGroupItem>
				</ToggleGroup>
			)}
		</>
	);
}

export default PoiDetailsRouteToggle;
