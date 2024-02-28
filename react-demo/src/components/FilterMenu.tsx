import { Twirl as Hamburger } from 'hamburger-react';
import { cn } from '@/lib/utils';

interface FilterMenuProps {
	className?: string | undefined;
	isOpen: boolean;
	setOpen: (open: boolean) => void;
	color: string;
	setColor: (open: string) => void;
	onClose: () => void;
}

function FilterMenu({
	className,
	isOpen,
	setOpen,
	color,
	setColor,
	onClose,
}: FilterMenuProps) {
	return (
		<div
			className={cn(
				'absolute z-30 p-1 top-5 lg:top-20 left-2 sm:left-5 hover:border-primary/70 rounded-2xl',
				isOpen
					? 'hover:border-rose-500 top-0 left-0 sm:left-7 lg:left-5 lg:top-20 sm:top-7 lg:p-3 rounded-full'
					: 'border-2 rounded-full bg-white/80',
				className
			)}
		>
			<Hamburger
				label='Menu'
				toggled={isOpen}
				size={26}
				toggle={() => setOpen(!isOpen)}
				color={color}
				onToggle={(toggled) => {
					if (toggled) {
						setColor('#e11d48');
					} else {
						onClose();
					}
				}}
			/>
		</div>
	);
}

export default FilterMenu;
