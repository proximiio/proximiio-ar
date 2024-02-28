import { t } from 'i18next';
import { cn } from '@/lib/utils';
import { MdLockReset } from 'react-icons/md';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

import useMapStore from '@/store/mapStore';

function ResetViewButton() {
	const map = useMapStore((state) => state.map);

	const resetView = useMapStore((state) => state.resetView);
	const locateMe = useMapStore((state) => state.locateMe);

	const resetViewHandler = () => {
		resetView();
    locateMe();
		if (Object.keys(map).length > 0) {
			map.refetch();
		}
	};
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div
						className={cn(
							'absolute z-[6] p-4 bottom-8 right-2 hover:border-primary/70 border-2 rounded-full bg-white/80 text-2xl cursor-pointer'
						)}
						onClick={resetViewHandler}
					>
						<MdLockReset />
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<p>{t('reset-view')}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

export default ResetViewButton;
