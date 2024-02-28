export interface KioskModel {
	name: string;
	latitude?: number;
	longitude?: number;
	level?: number;
	zoom?: number;
	pitch?: number;
	bearing?: number;
	bounds?: [[number, number], [number, number]];
	poiId?: string;
	id?: string;
}
