/* eslint-disable no-mixed-spaces-and-tabs */
import { Map } from 'proximiio-js-library/lib/components/map/main';
import { AmenityModel } from 'proximiio-js-library/lib/models/amenity';
import Feature from 'proximiio-js-library/lib/models/feature';
import { FloorModel } from 'proximiio-js-library/lib/models/floor';
import { PlaceModel } from 'proximiio-js-library/lib/models/place';
import { AdModel } from 'proximiio-js-library/lib/models/ad';
import { create } from 'zustand';
import { isPointWithinRadius } from 'geolib';
import { getFloorName } from '@/lib/utils';
import { SortedPoiItemModel } from '@/models/sortedPoiItem.model';
import {
	FilterCategoryModel,
	FilterItemModel,
} from '@/models/filterItem.model';
import { KioskModel } from '@/models/kiosk.model';
import { filterCategories } from './data';

// import { devtools } from 'zustand/middleware';
// define types for state values and actions separately
type State = {
	appSession?: string;
	appInitiated: boolean;
	map: Map;
	kioskMode: boolean;
	gpsMode: boolean;
	currentLang: string;
	places: PlaceModel[];
	currentPlace: PlaceModel;
	floors: FloorModel[];
	currentFloor: FloorModel;
	routeStart: Feature | 'kiosk';
	routeFinish: Feature;
	features: Feature[];
	amenities: AmenityModel[];
	accessibleRoute: boolean;
	filterCategories: FilterCategoryModel[];
	activeFilter: FilterItemModel;
	showCustomRoutePicker: boolean;
	haveRouteDetails: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	routeDetails: Record<string, any>;
	currentStep: number;
	activeKiosk: KioskModel | undefined;
	sidebarIsOpen: boolean;
	kiosks: KioskModel[];
	ads: AdModel[];
	activeAd: AdModel | undefined;
};

type Actions = {
	setAppSession: () => void;
	setAppInitiated: (initiated: boolean) => void;
	setMap: (map: Map) => void;
	setKioskMode: (isKiosk: boolean) => void;
	setCurrentLang: (language: string) => void;
	setPlaces: (places: PlaceModel[]) => void;
	setCurrentPlace: (place: PlaceModel) => void;
	setFloors: (floors: FloorModel[]) => void;
	setCurrentFloor: (floor: FloorModel) => void;
	setRouteStart: (feature: Feature | 'kiosk') => void;
	setRouteFinish: (feature: Feature) => void;
	setFeatures: (features: Feature[]) => void;
	setAmenities: (amenities: AmenityModel[]) => void;
	setAccessibleRoute: (accessibleRoute: boolean) => void;
	setActiveFilter: (activeFilter: FilterItemModel) => void;
	setShowCustomRoutePicker: (visible: boolean) => void;
	setHaveRouteDetails: (haveDetails: boolean) => void;
	setRouteDetails: (route: unknown) => void;
	setCurrentStep: (step: number) => void;
	setKiosks: (kiosks: KioskModel[]) => void;
	setActiveKiosk: (kiosk: KioskModel | undefined) => void;
	setAds: (ads: AdModel[]) => void;
	setActiveAd: (ad: AdModel | undefined) => void;
	setSidebarIsOpen: (isOpen: boolean) => void;
	getSortedPOIs: () => SortedPoiItemModel[];
	locateMe: () => void;
	resetView: () => void;
	reset: () => void;
};

// define the initial state
const initialState: State = {
	appSession: undefined,
	appInitiated: false,
	map: {} as Map,
	kioskMode: false,
	gpsMode: import.meta.env.VITE_WAYFINDING_USE_GPS_LOCATION === 'true',
	currentLang: 'en',
	places: [],
	currentPlace: {} as PlaceModel,
	floors: [],
	currentFloor: {} as FloorModel,
	routeStart: {} as Feature,
	routeFinish: {} as Feature,
	features: [],
	amenities: [],
	accessibleRoute: false,
	filterCategories,
	activeFilter: {} as FilterItemModel,
	showCustomRoutePicker: false,
	haveRouteDetails: false,
	routeDetails: {},
	currentStep: 0,
	kiosks: [],
	activeKiosk: {} as KioskModel,
	ads: [],
	activeAd: {} as AdModel,
	sidebarIsOpen: false,
};

const defaultPlaceId = import.meta.env.VITE_WAYFINDING_DEFAULT_PLACE_ID;

const generateSessionId = () => {
	return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

const assignProperties = (
	poi: Feature,
	floors: FloorModel[],
	currentLang: string
) => {
	if (poi.properties) {
		if (!poi.properties._dynamic) poi.properties._dynamic = {};
		if (!poi.geometry.type) poi.geometry.type = 'Point';
		poi.properties.title =
			poi.properties.title_i18n && poi.properties.title_i18n[currentLang]
				? poi.properties.title_i18n[currentLang]
				: poi.properties.title;
		poi.properties._dynamic.floor = poi.properties.floor_id
			? floors.find((i) => i.id === poi.properties.floor_id)
			: null;
		poi.properties._dynamic.floorName = poi.properties._dynamic.floor
			? getFloorName({
					floor: poi.properties._dynamic.floor,
					language: currentLang,
			  })
			: null;
	}
	return poi;
};

const useMapStore = create<State & Actions>()(
	//devtools(
	(set, get) => ({
		...initialState,
		setAppSession: () => {
			const sessionId = generateSessionId();
			console.log('SETTING APP SESSION', sessionId);
			set(() => ({ appSession: sessionId }));
		},
		setAppInitiated: (initiated) => {
			set(() => ({ appInitiated: initiated }));
		},
		setMap: (map) => {
			set(() => ({ map }));
		},
		setKioskMode: (isKiosk) => {
			set(() => ({ kioskMode: isKiosk }));
		},
		setCurrentLang: (language) => {
			set(() => ({ currentLang: language }));
		},
		setPlaces: (places) => {
			set(() => ({ places }));
		},
		setCurrentPlace: (place) => {
			set(() => ({ currentPlace: place }));
		},
		setFloors: (floors) => {
			set(() => ({ floors }));
		},
		setCurrentFloor: (floor) => {
			set(() => ({ currentFloor: floor }));
		},
		setRouteStart: (feature) => {
			set(() => {
				if (feature !== 'kiosk') {
					feature = assignProperties(feature, get().floors, get().currentLang);
				}
				return { routeStart: feature };
			});
		},
		setRouteFinish: (feature) => {
			set(() => {
				feature = assignProperties(feature, get().floors, get().currentLang);
				return { routeFinish: feature };
			});
		},
		setFeatures: (features) => {
			set(() => ({ features }));
		},
		setAmenities: (amenities) => {
			set(() => ({ amenities }));
		},
		setAccessibleRoute: (accessibleRoute) => {
			set(() => ({ accessibleRoute }));
		},
		setActiveFilter: (activeFilter) => {
			set(() => ({ activeFilter }));
		},
		setShowCustomRoutePicker: (visible) => {
			set(() => ({ showCustomRoutePicker: visible }));
		},
		setHaveRouteDetails: (haveDetails) => {
			set(() => ({ haveRouteDetails: haveDetails }));
		},
		setRouteDetails: (route) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			set(() => ({ routeDetails: route as any }));
		},
		setCurrentStep: (step) => {
			set(() => ({ currentStep: step }));
		},
		setKiosks: (kiosks) => {
			set(() => ({ kiosks }));
		},
		setActiveKiosk: (kiosk: KioskModel | undefined) => {
			set(() => ({ activeKiosk: kiosk }));
		},
		setAds: (ads) => {
			set(() => ({ ads }));
		},
		setActiveAd: (ad: AdModel | undefined) => {
			set(() => ({ activeAd: ad }));
		},
		setSidebarIsOpen: (isOpen: boolean) => {
			set(() => ({ sidebarIsOpen: isOpen }));
		},
		getSortedPOIs: () => {
			const pois: SortedPoiItemModel[] = get()
				.features.filter(
					(feature) =>
						(feature.properties.usecase === 'poi' ||
							feature.properties.type === 'poi') &&
						feature.properties.type !== 'escalator' &&
						feature.properties.type !== 'elevator' &&
						feature.properties.type !== 'staircase' &&
						feature.properties.place_id === defaultPlaceId &&
						feature.properties.title.trim() !== ''
				)
				.sort((a, b) => (a.properties.title > b.properties.title ? -1 : 1))
				.sort((a, b) => (a.properties.level > b.properties.level ? 1 : -1))
				.map((item) => {
					const isInside = isPointWithinRadius(
						{
							lat: item.geometry.coordinates[1],
							lng: item.geometry.coordinates[0],
						},
						{
							lat: get().currentPlace.location.lat,
							lng: get().currentPlace.location.lng,
						},
						10000
					);
					const floor = get().floors.find(
						(floor) => floor.id === item.properties.floor_id
					);

					// rewrite feature title based on current language
					item.properties.title = item.properties?.title_i18n
						? item.properties.title_i18n[get().currentLang]
							? item.properties.title_i18n[get().currentLang]
							: item.properties.title_i18n?.en
						: item.properties.title;

					return {
						...item,
						icon: get().amenities.filter(
							(amenity) => amenity.id === item.properties.amenity
						)[0]
							? get().amenities.filter(
									(amenity) => amenity.id === item.properties.amenity
							  )[0].icon
							: '',
						category: get().amenities.filter(
							(amenity) => amenity.id === item.properties.amenity
						)[0]
							? get().amenities.filter(
									(amenity) => amenity.id === item.properties.amenity
							  )[0].title
							: '',
						search_query: item.properties.title + ' ' + item.properties.level,
						coordinates: item.geometry.coordinates,
						isInside,
						score: 0,
						foundInDescription: false,
						floor,
						floorName: floor
							? getFloorName({ floor, language: get().currentLang })
							: '',
					};
				})
				.filter((item) => item.isInside);
			return pois;
		},
		reset: () => {
			set(initialState);
		},
		locateMe: () => {
			if (Object.keys(get().map).length > 0) {
				get()
					.map.getMapboxInstance()
					.flyTo({
						center: [
							get().kioskMode && get().activeKiosk?.longitude
								? get().activeKiosk!.longitude!
								: +import.meta.env.VITE_WAYFINDING_DEFAULT_LOCATION_LONGITUDE,
							get().kioskMode && get().activeKiosk?.latitude
								? get().activeKiosk!.latitude!
								: +import.meta.env.VITE_WAYFINDING_DEFAULT_LOCATION_LATITUDE,
						],
						bearing:
							get().kioskMode && get().activeKiosk?.bearing
								? get().activeKiosk!.bearing!
								: +import.meta.env.VITE_WAYFINDING_DEFAULT_BEARING,
						pitch:
							get().kioskMode && get().activeKiosk?.pitch
								? get().activeKiosk!.pitch!
								: +import.meta.env.VITE_WAYFINDING_DEFAULT_PITCH,
						zoom:
							get().kioskMode && get().activeKiosk?.zoom
								? get().activeKiosk!.zoom!
								: +import.meta.env.VITE_WAYFINDING_DEFAULT_ZOOM,
					});
				get().map.setFloorByLevel(
					get().kioskMode && get().activeKiosk?.level
						? get().activeKiosk!.level!
						: +import.meta.env.VITE_WAYFINDING_DEFAULT_LOCATION_LEVEL
				);
			}
		},
		resetView() {
			set({
				routeStart: {} as Feature,
				routeFinish: {} as Feature,
				activeFilter: {} as FilterItemModel,
				showCustomRoutePicker: false,
				haveRouteDetails: false,
				sidebarIsOpen: false,
			});
		},
	})
	//{ name: 'mapStore' }
	//)
);

export default useMapStore;
