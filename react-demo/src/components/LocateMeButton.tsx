import { MdMyLocation } from 'react-icons/md';
import { cn } from '@/lib/utils';

import useMapStore from '@/store/mapStore';

function LocateMeButton() {
	const locateMe = useMapStore((state) => state.locateMe);

	return (
		<div
			className={cn(
				'absolute z-[6] p-4 top-[160px] lg:top-40 left-2 sm:left-5 hover:border-primary/70 border-2 rounded-full bg-white/80 text-2xl cursor-pointer'
			)}
			onClick={locateMe}
		>
			<MdMyLocation />
		</div>
	);
}

export default LocateMeButton;
