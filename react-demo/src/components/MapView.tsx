/* eslint-disable no-mixed-spaces-and-tabs */
import { useEffect, useRef } from 'react';
import Proximiio from 'proximiio-js-library';
import { State } from 'proximiio-js-library/lib/components/map/main';
import maplibregl from 'maplibre-gl';
import { useShallow } from 'zustand/react/shallow';
import {
	osName,
	browserName,
	mobileModel,
	mobileVendor,
	deviceType,
} from 'react-device-detect';
import useRouting from '@/hooks/useRouting';
import { FilterItemModel } from '@/models/filterItem.model';
import i18n from '@/i18n';

import useMapStore from '@/store/mapStore';
import { kiosks as predefinedKiosks } from '@/store/data';

function MapView() {
	const mapInitiated = useRef(false);
	const [findRoute] = useRouting();
	const zoom = import.meta.env.VITE_WAYFINDING_DEFAULT_ZOOM;
	const pitch = import.meta.env.VITE_WAYFINDING_DEFAULT_PITCH;
	const bearing = import.meta.env.VITE_WAYFINDING_DEFAULT_BEARING;
	const defaultPlaceId = import.meta.env.VITE_WAYFINDING_DEFAULT_PLACE_ID;
	const defaultLocation = {
		coordinates: [
			+import.meta.env.VITE_WAYFINDING_DEFAULT_LOCATION_LONGITUDE,
			+import.meta.env.VITE_WAYFINDING_DEFAULT_LOCATION_LATITUDE,
		],
		level: +import.meta.env.VITE_WAYFINDING_DEFAULT_LOCATION_LEVEL,
	};
	const mapPadding = {
		top: 250,
		bottom: 250,
		left: 250,
		right: 250,
	};
	const refetchData =
		import.meta.env.VITE_WAYFINDING_AUTO_DATA_REFETCH === 'true';
	const showAds = import.meta.env.VITE_WAYFINDING_SHOW_ADS === 'true';

	// store state
	const kioskMode = useMapStore((state) => state.kioskMode);
	const gpsMode = useMapStore((state) => state.gpsMode);
	const currentLang = useMapStore((state) => state.currentLang);
	const filterCategories = useMapStore((state) => state.filterCategories);
	const map = useMapStore((state) => state.map);
	const routeFinish = useMapStore((state) => state.routeFinish);
	const routeStart = useMapStore((state) => state.routeStart);
	const activeFilter = useMapStore((state) => state.activeFilter);
	const activeKiosk = useMapStore((state) => state.activeKiosk);
	const features = useMapStore((state) => state.features);
	const places = useMapStore((state) => state.places);
	const currentPlace = useMapStore((state) => state.currentPlace);
	const accessibleRoute = useMapStore((state) => state.accessibleRoute);
	const kiosks = useMapStore((state) => state.kiosks);
	const amenities = useMapStore((state) => state.amenities);
	const ads = useMapStore((state) => state.ads);
	const appSession = useMapStore((state) => state.appSession);

	// store actions
	const setMap = useMapStore(useShallow((state) => state.setMap));
	const setPlaces = useMapStore((state) => state.setPlaces);
	const setCurrentPlace = useMapStore((state) => state.setCurrentPlace);
	const setFloors = useMapStore((state) => state.setFloors);
	const setKiosks = useMapStore((state) => state.setKiosks);
	const setCurrentFloor = useMapStore((state) => state.setCurrentFloor);
	const setFeatures = useMapStore((state) => state.setFeatures);
	const setAmenities = useMapStore((state) => state.setAmenities);
	const setRouteStart = useMapStore((state) => state.setRouteStart);
	const setRouteFinish = useMapStore((state) => state.setRouteFinish);
	const setHaveRouteDetails = useMapStore((state) => state.setHaveRouteDetails);
	const setRouteDetails = useMapStore((state) => state.setRouteDetails);
	const setCurrentStep = useMapStore((state) => state.setCurrentStep);
	const setActiveFilter = useMapStore((state) => state.setActiveFilter);
	const setActiveKiosk = useMapStore((state) => state.setActiveKiosk);
	const setAccessibleRoute = useMapStore((state) => state.setAccessibleRoute);
	const setShowCustomRoutePicker = useMapStore(
		(state) => state.setShowCustomRoutePicker
	);
	const setActiveAd = useMapStore((state) => state.setActiveAd);

	// This effect hook handles route finish state changes
	useEffect(() => {
		console.log('finish effect');
		if (routeFinish?.id) {
			console.log('routeFinish', routeFinish);
			// center the map, set the floor level to poi
			map.getMapboxInstance().flyTo({
				center: routeFinish.geometry.coordinates as [number, number],
				zoom: 19,
			});
			map.setFloorByLevel(routeFinish.properties.level);
			// handle polygon selection, only required when polygons are enabled
			map.handlePolygonSelection(routeFinish);
			setActiveFilter({} as FilterItemModel);
			setShowCustomRoutePicker(false);

			// save select log for feature & amenity
			const urlParams = new URLSearchParams(window.location.search);
			const destinationParam = urlParams.get('destinationFeature');
			const qrParam = urlParams.get('qrCode');
			const routedFromParams =
				destinationParam &&
				(destinationParam === routeFinish.id ||
					destinationParam === routeFinish.properties.id ||
					destinationParam === routeFinish.properties.title);
			let source: 'manual' | 'qr' | 'urlParam' = 'manual';

			if (routedFromParams) {
				source = qrParam ? 'qr' : 'urlParam';
			}

			const featureAmenity = amenities.find(
				(i) => i.id === routeFinish.properties.amenity
			);
			const userData = {
				osName,
				browserName,
				mobileModel,
				mobileVendor,
				deviceType,
			};
			new Proximiio.SelectLogger({
				clickedElementId: routeFinish.id,
				clickedElementType: 'feature',
				clickedElementTitle: routeFinish.properties.title,
				kioskId: activeKiosk?.id ? activeKiosk?.id : activeKiosk?.name,
				metadata: userData,
				source,
				language: currentLang,
				session: appSession,
			});
			if (featureAmenity) {
				new Proximiio.SelectLogger({
					clickedElementId: routeFinish.properties.amenity,
					clickedElementType: 'amenity',
					clickedElementTitle: featureAmenity.title,
					kioskId: activeKiosk?.id ? activeKiosk?.id : activeKiosk?.name,
					metadata: userData,
					source,
					language: currentLang,
					session: appSession,
				});
			}
		} else {
			console.log('routeFinish cancelled', routeFinish);
			if (Object.keys(map).length > 0) {
				// cancel route if it's rendered
				map.cancelRoute();
				// remove polygon selection after route finish is cancelled
				map.handlePolygonSelection();
			}
		}
	}, [
		map,
		routeFinish,
		amenities,
		activeKiosk,
		appSession,
		currentLang,
		setActiveFilter,
		setShowCustomRoutePicker,
	]);

	// This effect hook handles route start state changes
	useEffect(() => {
		console.log('start efffect');
		if (routeStart === 'kiosk' || routeStart?.id) {
			console.log('routeStart', routeStart);
			// if we also have route finish generate route and reset the current step
			if (routeFinish?.id) {
				findRoute({
					finish: routeFinish.id,
					start: routeStart === 'kiosk' ? undefined : routeStart.id,
				});
				setCurrentStep(0);
				return;
			}
		}
	}, [routeStart, routeFinish, findRoute, setCurrentStep]);

	// This effect hook handles active filter state changes
	useEffect(() => {
		console.log('active filter effect');
		if (activeFilter?.id) {
			const foundCategory = filterCategories.find((category) =>
				category.items.find((items) => items.id === activeFilter.id)
			);
			console.log('active filter', activeFilter);
			map.setAmenityFilter(activeFilter.id, foundCategory!.title);
		} else {
			console.log('active filter cancelled', activeFilter);
			if (Object.keys(map).length > 0) {
				map.resetAmenityFilters();
			}
		}
	}, [map, activeFilter, filterCategories]);

	// This effect hook handles URL query parameters related to start, destination and place
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const startParam = urlParams.get('startFeature'); // in case you change url param name in urlParams option of map constuctor, change that too
		const destinationParam = urlParams.get('destinationFeature'); // in case you change url param name in urlParams option of map constuctor, change that too
		const placeParam = urlParams.get('defaultPlace'); // in case you change url param name in urlParams option of map constuctor, change that too

		const startFeature = startParam
			? features.find(
					(f) =>
						f.id === startParam ||
						f.properties.id === startParam ||
						f.properties.title === startParam
			  )
			: undefined;
		if (startFeature) {
			setRouteStart(startFeature);
		}

		const destinationFeature = destinationParam
			? features.find(
					(f) =>
						f.id === destinationParam ||
						f.properties.id === destinationParam ||
						f.properties.title === destinationParam
			  )
			: undefined;
		if (destinationFeature) {
			setRouteFinish(destinationFeature);
		}

		const defaultPlace = placeParam
			? places.find((p) => p.id === placeParam || p.name === placeParam)
			: undefined;
		if (defaultPlace) {
			map.setPlace(defaultPlace.id);
		}
	}, [features, setRouteFinish, setRouteStart, places, currentPlace, map]);

	// This effect hook language change
	useEffect(() => {
		console.log('change language', currentLang);
		i18n.changeLanguage(currentLang);
		if (Object.keys(map).length > 0) {
			map.setLanguage(currentLang);
		}
	}, [currentLang, map]);

	// This effect hook kiosks change
	useEffect(() => {
		if (kiosks.length > 0 && Object.keys(map).length > 0) {
			// handle kiosk mode intitialization
			const urlParams = new URLSearchParams(window.location.search);
			if (urlParams.get('kiosk') && kioskMode) {
				const kiosk = kiosks.find(
					(kiosk) =>
						kiosk.name === urlParams.get('kiosk') ||
						kiosk.id === urlParams.get('kiosk')
				);
				setActiveKiosk(kiosk);

				const kioskPoi = features.find((f) => f.id === activeKiosk?.poiId);

				if (activeKiosk?.bounds) {
					map.getMapboxInstance().setMaxBounds(activeKiosk.bounds);
				}
				if (activeKiosk?.zoom) {
					map.getMapboxInstance().setZoom(activeKiosk.zoom);
				}
				if (activeKiosk?.bearing) {
					map.getMapboxInstance().setBearing(activeKiosk.bearing);
				}
				if (activeKiosk?.pitch) {
					map.getMapboxInstance().setPitch(activeKiosk.pitch);
				}

				if (activeKiosk) {
					if (kioskPoi) {
						activeKiosk.longitude = kioskPoi.geometry.coordinates[0];
						activeKiosk.latitude = kioskPoi.geometry.coordinates[1];
						activeKiosk.level = kioskPoi.properties.level;
					}

					if (
						activeKiosk.longitude &&
						activeKiosk.latitude &&
						typeof activeKiosk.level !== 'undefined'
					) {
						map.setKiosk(
							activeKiosk.latitude,
							activeKiosk.longitude,
							activeKiosk.level
						);
						setTimeout(() => {
							setRouteStart('kiosk');
						}, 1000);
					}
				}
			}
		}
	}, [
		kiosks,
		activeKiosk,
		features,
		kioskMode,
		map,
		setActiveKiosk,
		setRouteStart,
	]);

	// This effect handles ads
	useEffect(() => {
		if (showAds) {
			const defaultAd = ads.find((ad) => ad.isDefault);

			if (activeFilter?.id) {
				const amenityAd = ads.find((ad) => {
					if (Array.isArray(activeFilter.id)) {
						ad.amenities?.some((ad) => activeFilter.id!.includes(ad));
						return;
					}
					if (typeof activeFilter.id === 'string') {
						return ad.amenities?.includes(activeFilter.id);
					}
				});
				if (amenityAd) {
					setActiveAd(amenityAd);
					return;
				} else {
					setActiveAd(defaultAd);
					return;
				}
			} else {
				setActiveAd(defaultAd);
			}

			if (routeFinish?.id) {
				const amenityAd = ads.find((ad) =>
					ad.amenities?.includes(routeFinish.properties.amenity)
				);
				const poiAd = ads.find((ad) => ad.features?.includes(routeFinish.id));
				if (poiAd) {
					setActiveAd(poiAd);
					return;
				}
				if (amenityAd) {
					setActiveAd(amenityAd);
					return;
				}
				if (!poiAd && !amenityAd) {
					setActiveAd(defaultAd);
					return;
				}
			} else {
				setActiveAd(defaultAd);
			}
		}
	}, [routeFinish, showAds, ads, activeFilter.id, setActiveAd]);

	useEffect(() => {
		// Initialize map only once
		if (mapInitiated.current) return;
		mapInitiated.current = true;

		// Authenticate Proximiio.js library and create map instance with provided constructor options
		Proximiio.Auth.loginWithToken(import.meta.env.VITE_PROXIMIIO_TOKEN).then(
			() => {
				// when authenticated create a map instance with provided constuctor options, check out library readme https://github.com/proximiio/proximiio-js-library#map-component
				const map = new Proximiio.Map({
					// you can define any of the mapbox options in there, we are retrieving those from state service
					mapboxOptions: {
						center: [
							+import.meta.env.VITE_WAYFINDING_DEFAULT_LOCATION_LONGITUDE,
							+import.meta.env.VITE_WAYFINDING_DEFAULT_LOCATION_LATITUDE,
						],
						zoom: zoom,
						pitch: kioskMode && activeKiosk?.pitch ? activeKiosk.pitch : pitch,
						bearing:
							kioskMode && activeKiosk?.bearing ? activeKiosk.bearing : bearing,
					},
					defaultPlaceId: defaultPlaceId, // if you have more than 1 place in your account, it's a good idea to define defaultPlaceId for the map, otherwise the first one will be picked up
					isKiosk: kioskMode, // if enabled starting point for routing will be based on values defined in kioskSettings, if disabled findRoute methods will expect start point to be send.
					kioskSettings: {
						coordinates:
							kioskMode && activeKiosk?.longitude && activeKiosk?.latitude
								? [activeKiosk.longitude, activeKiosk.latitude]
								: (defaultLocation.coordinates as [number, number]),
						level:
							kioskMode && activeKiosk?.level
								? activeKiosk.level
								: defaultLocation.level,
					},
					fitBoundsPadding: mapPadding, // setting the padding option to use for zooming into the bounds when route is drawn,
					handleUrlParams: true, // enable handling url params, this way you can load map with predefined route generated
					language: currentLang, // init with predefined language setting
					useGpsLocation: gpsMode, // if enabled your location will be detected with geolocation API and used as a starting point for routing
					geolocationControlOptions: {
						autoTrigger: true, // if enabled map will automatically enable geolocation
						autoLocate: false, // if enabled map will automatically focus on user location
						position: 'top-right', //  position on the map to which the control will be added.
					},
					showLevelDirectionIcon: true, // if enabled arrow icon will be shown at the levelchanger indicating direction of level change along the found route
					initPolygons: true,
					routeAnimation: {
						enabled: true,
						type: 'point',
					},
					blockFeatureClickWhileRouting: true,
					defaultFloorLevel: +import.meta.env
						.VITE_WAYFINDING_DEFAULT_LOCATION_LEVEL,
					zoomIntoPlace: false,
					defaultFilter: {
						key: 'properties.metadata.exhibition',
						value: 'test',
					},
				});

				map.getMapReadyListener().subscribe((ready) => {
					console.log('map ready', ready);
					const mapState: State = map.getMapState();

					// setting mapbox navigationControl buttons
					map.getMapboxInstance().addControl(
						new maplibregl.NavigationControl({
							showZoom: false,
						})
					);

					setMap(map);
					setPlaces(mapState.places);
					setCurrentPlace(mapState.place);
					setFloors(mapState.floors);
					setCurrentFloor(mapState.floor);
					setFeatures(mapState.allFeatures.features);
					setAmenities(mapState.amenities);
					setKiosks([
						...predefinedKiosks,
						...mapState.kiosks.map((kiosk) => {
							return {
								...kiosk,
								latitude: kiosk.coordinates.lat,
								longitude: kiosk.coordinates.lng,
							};
						}),
					]);

					// set amenity category group from store/data.ts
					for (const category of filterCategories) {
						map.setAmenitiesCategory(
							category.title,
							category.items.map((i) => (i.id ? i.id : 'undefined')).flat(2)
						);
					}
				});

				// set data refetching interval if enabled in .env file
				if (refetchData) {
					setInterval(() => {
						map.refetch();
					}, +import.meta.env.VITE_WAYFINDING_REFETCH_INTERVAL);
				}

				// set destination point for routing based on click event and cancel previous route if generated
				map.getPolygonClickListener().subscribe((feature) => {
					setRouteFinish(feature);
				});

				// subscribe to map place selection listener, this always run once at map initiation and upon map.setPlace method call
				map.getPlaceSelectListener().subscribe((place) => {
					setCurrentPlace(place);
				});

				// subscribe to map floor selection listener, this always run once at map initiation and upon map.setFloor method call
				map.getFloorSelectListener().subscribe((floor) => {
					setCurrentFloor(floor);
				});

				// subscribe to route found listener
				map.getRouteFoundListener().subscribe((res) => {
					console.log('route found', res);
					if (res.details && res.TBTNav) {
						setHaveRouteDetails(true);
						setRouteDetails(res);
					}
				});

				// subscribe to route failed listener
				map.getRouteFailedListener().subscribe((res) => {
					console.log('route failed', res);
					// if route found failed, try again with non/accessible route
					setAccessibleRoute(!accessibleRoute);
				});

				// subscribe to nav step listener and set current step from that
				map.getNavStepSetListener().subscribe((step) => {
					setCurrentStep(step);
				});
			}
		);
	});

	return (
		<>
			<div id='proximiioMap' className='w-full h-screen'></div>
		</>
	);
}
export default MapView;
