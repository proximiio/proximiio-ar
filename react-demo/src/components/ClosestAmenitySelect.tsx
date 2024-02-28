/* eslint-disable no-mixed-spaces-and-tabs */
import { useState } from 'react';
import { t } from 'i18next';
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

function ClosestAmenitySelect() {
	const activeFilter = useMapStore((state) => state.activeFilter);
	const closestItems = useMapStore((state) => state.filterCategories)
		.map((category) => category.items)
		.flat()
		.filter((i) => i.type === 'closest');

	const setActiveFilter = useMapStore((state) => state.setActiveFilter);

	const [open, setOpen] = useState(false);

	const onSelectHandle = (itemTitle: string) => {
		const filterItem = closestItems.find(
			(item) => item.title.toLowerCase() === itemTitle
		)!;
		setOpen(false);
		setActiveFilter(filterItem);
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
					{activeFilter?.id
						? `${t('closest')} ${t(
								closestItems.find((item) => item.title === activeFilter.title)!
									.title
						  )}`
						: t('destination')}
					<ChevronsUpDown className='w-4 h-4 ml-2 opacity-50 shrink-0' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='lg:min-w-[320px] p-0'>
				<Command>
					<CommandInput placeholder={t('destination')} />
					<CommandEmpty>{t('no-results')}</CommandEmpty>
					<CommandGroup>
						{closestItems.map((item) => (
							<CommandItem
								key={item.title}
								value={item.title}
								onSelect={onSelectHandle}
								className='cursor-pointer'
							>
								<Check
									className={cn(
										'mr-2 h-4 w-4',
										activeFilter.title === item.title
											? 'opacity-100'
											: 'opacity-0'
									)}
								/>
								{`${t('closest')} ${t(item.title)}`}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

export default ClosestAmenitySelect;
