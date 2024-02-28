import { FloorModel } from 'proximiio-js-library/lib/models/floor';
import { Button } from '@/components/ui/button';
import { getFloorName } from '@/lib/utils';

import useMapStore from '@/store/mapStore';

function FloorPicker() {
	//store state
	const map = useMapStore((state) => state.map);
	const floors = useMapStore((state) => state.floors);
	const currentFloor = useMapStore((state) => state.currentFloor);
	const currentLang = useMapStore((state) => state.currentLang);

	const handleFloorClick = (floor: FloorModel) => {
		if (Object.keys(map).length > 0) {
			map.setFloorById(floor.id);
		}
	};

	const floorsList = floors.map((floor) => {
		return (
			<Button
				key={floor.id}
				variant={currentFloor?.id === floor.id ? 'dark' : 'default'}
				onClick={() => handleFloorClick(floor)}
				className='h-8 min-w-8 sm:min-w-12 sm:h-12'
			>
				{getFloorName({ floor, language: currentLang })}
			</Button>
		);
	});

	return (
		<div className='absolute z-10 flex items-center justify-center gap-1 left-[calc(50%-90px)] flex-wrap w-[180px] sm:left-[calc(50%-230px)] top-5 sm:w-[460px]'>
			{floorsList}
		</div>
	);
}
export default FloorPicker;
