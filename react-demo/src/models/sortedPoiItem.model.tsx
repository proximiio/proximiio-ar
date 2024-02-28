import { Geometry } from "proximiio-js-library/lib/models/feature";
import { FloorModel } from "proximiio-js-library/lib/models/floor";

export interface SortedPoiItemModel {
	type: 'Feature';
	id: string;
	geometry: Geometry;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	properties: Record<string, any>;
	icon: string;
	category: string;
	search_query: string;
	coordinates: number[];
	isInside: boolean;
	score: number;
	foundInDescription: boolean;
	floor: FloorModel | undefined;
	floorName: string;
}