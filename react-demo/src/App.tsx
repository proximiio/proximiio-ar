import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Proximiio from 'proximiio-js-library';
import useKiosk from '@/hooks/useKiosk';
import MapView from '@/components/MapView';
import FloorPicker from '@/components/FloorPicker';
import PoiSearch from '@/components/PoiSearch';
import Sidebar from '@/components/Sidebar';
import LocateMeButton from '@/components/LocateMeButton';
import LanguageToggle from '@/components/LanguageToggle';
import ResetViewButton from '@/components/ResetViewButton';
import { Toaster } from '@/components/ui/toaster';
import useMapStore from '@/store/mapStore';
import { cn } from './lib/utils';
import AR from './components/AR';

function App() {
	const showLanguageToggle =
		import.meta.env.VITE_WAYFINDING_SHOW_LANGUAGE_TOGGLE === 'true';
	const showResetViewButton =
		import.meta.env.VITE_WAYFINDING_SHOW_RESET_BUTTON === 'true';
	const showAds = import.meta.env.VITE_WAYFINDING_SHOW_ADS === 'true';
	const { t, i18n } = useTranslation();
	const [idleTime] = useKiosk();

	const [appInitiated, setAppInitiated] = useMapStore((state) => [
		state.appInitiated,
		state.setAppInitiated,
	]);
	const [kioskMode, setKioskMode] = useMapStore((state) => [
		state.kioskMode,
		state.setKioskMode,
	]);

	const map = useMapStore((state) => state.map);
	const activeAd = useMapStore((state) => state.activeAd);

	const setCurrentLang = useMapStore((state) => state.setCurrentLang);
	const setAds = useMapStore((state) => state.setAds);
	const setActiveAd = useMapStore((state) => state.setActiveAd);
	const setAppSession = useMapStore((state) => state.setAppSession);

	// This effect hook handles URL query parameters related to language and kiosk mode
	useEffect(() => {
		if (appInitiated) return;

		// Extract URL query parameters
		const urlParams = new URLSearchParams(window.location.search);

		// Retrieve 'language' parameter from URL or default to 'en' if not found
		const urlLanguage = urlParams.get('language') ?? 'en';

		// Update language state with 'language' parameter from URL
		setCurrentLang(urlLanguage);
		i18n.changeLanguage(urlLanguage);

		// If 'kiosk' parameter exists in URL, set kiosk mode
		if (urlParams.get('kiosk')) {
			setKioskMode(true);
		}

		setAppInitiated(true);
	}, [appInitiated, i18n, setKioskMode, setCurrentLang, setAppInitiated]);

	// This effect hook handles map and kioskMode changes
	useEffect(() => {
		if (kioskMode) {
			idleTime();
		}
	}, [map, kioskMode, idleTime]);

	// This effect hook handles ads initiation
	useEffect(() => {
		if (showAds && Object.keys(map).length > 0) {
			Proximiio.Ads.getAds().then((res) => {
				const defaultAd = res.data.find((ad) => ad.isDefault);
				setAds(res.data);
				setActiveAd(defaultAd);
			});
		}
	}, [showAds, map, setAds, setActiveAd]);

	useEffect(() => {
		setAppSession();
	}, [setAppSession]);

	return (
		<>
			{appInitiated && (
				<main>
					<div className='flex'>
						{showAds && activeAd && (
							<div className='hidden w-1/4 xl:block'>
								<img
									src={activeAd.url}
									alt={activeAd.name}
									className='object-cover h-full'
								/>
							</div>
						)}
						<div
							className={cn(
								'w-full relative',
								showAds && activeAd && 'w-full xl:w-3/4'
							)}
						>
							{Object.keys(map).length === 0 && (
								<div className='absolute flex w-full h-screen'>
									<div className='mx-auto mt-[20%]'>
										<div className='w-40 h-40 mx-auto border border-gray-300 rounded-full animate-spin border-t-primary' />
										<h3 className='mt-8 text-3xl font-semibold'>
											{t('welcomeMessage')}
										</h3>
									</div>
								</div>
							)}
							<PoiSearch />
							<FloorPicker />
							<Sidebar />
							<LocateMeButton />
							{showLanguageToggle && <LanguageToggle />}
							{showResetViewButton && <ResetViewButton />}
							<MapView />
							<Toaster />
							<AR />
						</div>
					</div>
				</main>
			)}
		</>
	);
}

export default App;
