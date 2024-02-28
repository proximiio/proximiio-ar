import { useCallback, useEffect, useRef, useState } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { GoDot } from 'react-icons/go';
import { t } from 'i18next';
import removeAccents from 'remove-accents';
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from '@/components/ui/command';
import { SortedPoiItemModel } from '@/models/sortedPoiItem.model';

import useMapStore from '@/store/mapStore';

function PoiSearch() {
	// store state
	const pois = useMapStore((state) => state.getSortedPOIs());
	const currentLang = useMapStore((state) => state.currentLang);
	const features = useMapStore((state) => state.features);
	const kioskMode = useMapStore((state) => state.kioskMode);

	// store actions
	const setRouteFinish = useMapStore((state) => state.setRouteFinish);

	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [filteredPois, setFilteredPois] = useState<SortedPoiItemModel[]>(pois);
	const [foundInTitle, setFoundInTitle] = useState<SortedPoiItemModel[]>([]);
	const [foundInDescription, setFoundInDescription] = useState<
		SortedPoiItemModel[]
	>([]);

	const keyboard = useRef<Keyboard>();

	const onSelectHandle = useCallback(
		(featureId: string) => {
			const feature = features.find((item) => item.id === featureId)!;
			setOpen(false);
			setRouteFinish(feature);
		},
		[features, setRouteFinish]
	);

	// store filtered pois in ref to ensure that filteredPoisRef.current always holds the latest value of filteredPois
	const filteredPoisRef = useRef<SortedPoiItemModel[]>([]);
	useEffect(() => {
		filteredPoisRef.current = filteredPois;
	}, [filteredPois]);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'f' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, []);

	useEffect(() => {
		const onChange = (input: string, e: MouseEvent | undefined) => {
			e?.stopPropagation();
			setSearch(input);
		};

		const onKeyPress = (button: string, e: MouseEvent | undefined) => {
			e?.stopPropagation();
			if (button === '{enter}') {
				if (filteredPoisRef.current.length > 0) {
					onSelectHandle(filteredPoisRef.current[0].id);
				}
			}
			if (button === '{shift}' || button === '{lock}') {
				handleShift();
			}
		};

		const handleShift = () => {
			const currentLayout = keyboard.current?.options.layoutName;
			const shiftToggle = currentLayout === 'default' ? 'shift' : 'default';

			keyboard.current?.setOptions({
				layoutName: shiftToggle,
			});
		};

		if (
			kioskMode &&
			import.meta.env.VITE_WAYFINDING_USE_VIRTUAL_KEYBOARD_AT_KIOSKS === 'true'
		) {
			if (open) {
				console.log('should open keyboard');
				if (!keyboard.current?.activeButtonClass) {
					keyboard.current = new Keyboard({
						preventMouseDownDefault: true,
						onChange: (input, e) => onChange(input, e),
						onKeyPress: (button, e) => onKeyPress(button, e),
					});
				}
			} else {
				console.log('should close keyboard');
				if (keyboard.current?.activeButtonClass) {
					keyboard.current?.destroy();
					keyboard.current = {} as Keyboard;
				}
			}
		}
	}, [open, kioskMode, filteredPois, onSelectHandle]);

	useEffect(() => {
		const filtered = [...pois]
			.map((item) => {
				const details =
					item.properties?.description_i18n &&
					item.properties?.description_i18n[currentLang]
						? item.properties.description_i18n[currentLang]
						: item.properties.description_i18n?.en;
				const title = removeAccents(item.properties.title);
				const term = removeAccents(search.toLowerCase());
				if (
					title.toLowerCase().indexOf(term) > -1 ||
					details?.toLowerCase().indexOf(term) > -1
				) {
					if (title.toLowerCase().startsWith(term)) {
						item.score = 3;
					} else if (title.toLowerCase().indexOf(term) > -1) {
						item.score = 2;
					} else if (details?.toLowerCase().indexOf(term) > -1) {
						item.score = 1;
						item.foundInDescription = true;
					}

					return item;
				}
			})
			.filter((i) => i && i.properties.title.trim() !== '')
			.sort((a, b) => {
				if (a && b) {
					return (
						b.score - a.score ||
						(a.properties.title > b.properties.title ? 1 : -1)
					);
				}
				return 0;
			}) as SortedPoiItemModel[];

		if (filtered.length !== filteredPois.length) {
			setFilteredPois(filtered);
			setFoundInTitle(filtered.filter((item) => !item.foundInDescription));
			setFoundInDescription(filtered.filter((item) => item.foundInDescription));
		}
	}, [search, currentLang, pois, filteredPois]);

	return (
		<>
			<button
				className='absolute right-auto z-10 flex items-center p-4 text-2xl transition-colors border-2 rounded-full lg:px-5 lg:py-2 lg:text-sm bg-white/80 top-[90px] lg:top-5 left-2 sm:left-5 text-muted-foreground hover:border-primary/70'
				onClick={() => setOpen(true)}
			>
				<HiMagnifyingGlass className='lg:mr-2' />
				<span className='hidden lg:inline'>
					{t('click-here-or-press')}
					<kbd className='pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 mx-2 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
						<span className='text-xs'>Ctrl + </span>F
					</kbd>
					{t('to-search')}
				</span>
			</button>
			<CommandDialog
				dialogProps={{ open: open, onOpenChange: setOpen }}
				commandProps={{ shouldFilter: false }}
			>
				<CommandInput
					placeholder={`${t('searchPlaceholder')}...`}
					value={search}
					onValueChange={setSearch}
				/>
				<CommandList>
					<CommandEmpty>{t('no-results')}</CommandEmpty>
					{foundInTitle.length > 0 && (
						<CommandGroup heading={t('suggestions')}>
							{foundInTitle.map((poi) => (
								<CommandItem
									key={poi.id}
									value={poi.id}
									onSelect={onSelectHandle}
									className='cursor-pointer'
								>
									<GoDot className='w-4 h-4 mr-2' />
									<span>{poi.properties?.title}</span>
									<CommandShortcut>{poi.floorName}</CommandShortcut>
								</CommandItem>
							))}
						</CommandGroup>
					)}
					{foundInDescription.length > 0 && (
						<>
							<CommandSeparator />
							<CommandGroup heading={t('found-in-description')}>
								{foundInDescription.map((poi) => (
									<CommandItem
										key={poi.id}
										value={poi.id}
										onSelect={onSelectHandle}
										className='cursor-pointer'
									>
										<GoDot className='w-4 h-4 mr-2' />
										<span>{poi.properties?.title}</span>
										<CommandShortcut>{poi.floorName}</CommandShortcut>
									</CommandItem>
								))}
							</CommandGroup>
						</>
					)}
				</CommandList>
			</CommandDialog>
		</>
	);
}

export default PoiSearch;
