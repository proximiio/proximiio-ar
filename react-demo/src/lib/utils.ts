import { type ClassValue, clsx } from 'clsx';
import { FloorModel } from 'proximiio-js-library/lib/models/floor';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getFloorName = ({
	floor,
	language,
}: {
	floor: FloorModel;
	language: string;
}) => {
	if (floor.name.length === 1 && Number(parseInt(floor.name))) {
		return `L${floor.name}`;
	}
	if (floor.metadata && (floor.metadata['title_' + language] as string)) {
		return floor.metadata['title_' + language] as string;
	}
	return floor.name;
};
