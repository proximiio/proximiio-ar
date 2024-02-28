import ReactCountryFlag from 'react-country-flag';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import useMapStore from '@/store/mapStore';

function LanguageToggle() {
	const setCurrentLang = useMapStore((state) => state.setCurrentLang);
	const currentLang = useMapStore((state) => state.currentLang);
	const gpsMode = useMapStore((state) => state.gpsMode);
	const languages = [
		{
			value: 'en',
			title: 'English',
			countryCode: 'US',
		},
		{
			value: 'fi',
			title: 'Finnish',
			countryCode: 'FI',
		},
		{
			value: 'it',
			title: 'Italian',
			countryCode: 'IT',
		},
		{
			value: 'ar',
			title: 'Arabic',
			countryCode: 'AE',
		},
	];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='outline'
					size='icon'
					className={cn(
						'absolute z-10 flex items-center justify-center w-12 h-12 overflow-hidden text-2xl border-2 rounded-full cursor-pointer right-2 top-20 hover:border-primary/70 bg-white/80',
						gpsMode && 'top-28'
					)}
				>
					<ReactCountryFlag
						countryCode={
							languages.find((i) => i.value === currentLang)
								? languages.find((i) => i.value === currentLang)!.countryCode
								: 'US'
						}
						svg
						className='!w-16 !h-16 max-w-none'
						title={
							languages.find((i) => i.value === currentLang)
								? languages.find((i) => i.value === currentLang)!.title
								: 'US'
						}
					/>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-auto min-w-0 p-0 bg-transparent border-0 shadow-none outline-none'>
				{languages
					.filter((i) => i.value !== currentLang)
					.map((language, idx) => (
						<DropdownMenuItem
							key={idx}
							onClick={() => setCurrentLang(language.value)}
							className='flex items-center justify-center w-10 h-10 p-0 mb-2 overflow-hidden border-2 rounded-full cursor-pointer border-black/20 hover:border-primary hover:bg-transparent focus:bg-transparent'
						>
							<ReactCountryFlag
								countryCode={language.countryCode}
								svg
								className='!w-12 !h-12 max-w-none'
								title={language.title}
							/>
						</DropdownMenuItem>
					))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default LanguageToggle;
