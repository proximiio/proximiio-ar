import { useState } from 'react';
import { t } from 'i18next';
import Feature from 'proximiio-js-library/lib/models/feature';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

import useMapStore from '@/store/mapStore';

interface PoiSelectProps {
	selectedPoi: Feature;
	placeholder: string;
	onSelect: (featureId: string) => void;
}

function PoiSelect({ selectedPoi, placeholder, onSelect }: PoiSelectProps) {
	const pois = useMapStore((state) => state.getSortedPOIs());

	const [open, setOpen] = useState(false);

	const onSelectHandle = (featureId: string) => {
		setOpen(false);
		onSelect(featureId);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className='lg:min-w-[320px] justify-between flex my-4'
				>
					{selectedPoi?.id
						? pois.find((poi) => poi.id === selectedPoi.id)?.properties.title
						: placeholder}
					<ChevronsUpDown className='w-4 h-4 ml-2 opacity-50 shrink-0' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='lg:min-w-[320px] p-0'>
				<Command
					className='h-64 overflow-auto'
					filter={(value, search) => {
						const feature = pois.find(
							(item) =>
								item.id === value &&
								item.properties.title.toLowerCase().includes(search.toLowerCase())
						);
						if (feature) return 1;
						return 0;
					}}
				>
					<CommandInput placeholder={placeholder} />
					<CommandEmpty>{t('no-results')}</CommandEmpty>
					<CommandGroup className='overflow-auto'>
						{pois.map((poi) => (
							<CommandItem
								key={poi.id}
								value={poi.id}
								onSelect={onSelectHandle}
								className='cursor-pointer'
							>
								<Check
									className={cn(
										'mr-2 h-4 w-4',
										selectedPoi.id === poi.id ? 'opacity-100' : 'opacity-0'
									)}
								/>
								<span className='flex-1'>{poi.properties.title}</span>
								<span className='text-black/30'>
									{t('floor')}: {poi.floorName}
								</span>
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

export default PoiSelect;
