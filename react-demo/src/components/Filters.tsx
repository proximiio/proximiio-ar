import { t } from 'i18next';
import { motion } from 'framer-motion';
import FilterPicker from './FilterPicker';

import useMapStore from '@/store/mapStore';

function Filters() {
	const filterCategories = useMapStore((state) => state.filterCategories);

	return (
		<>
			<motion.div
				key='filters'
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0 }}
				transition={{ duration: 0.2 }}
				className='absolute top-0 left-0 right-0 z-20 p-3 pt-5 bg-white shadow-lg sm:z-10 rounded-b-md sm:shadow-none sm:border-2 sm:rounded-lg sm:bg-white/80 sm:top-5 lg:top-20 sm:left-5 sm:p-5 sm:pt-16 sm:right-auto'
			>
				{filterCategories.map((category) => (
					<FilterPicker
						key={category.title}
						heading={t(category.title)}
						items={category.items}
						color={category.colorVariant}
					/>
				))}
			</motion.div>
		</>
	);
}

export default Filters;
