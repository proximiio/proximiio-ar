import { motion } from 'framer-motion';

import useMapStore from '@/store/mapStore';
import React from 'react';

function InfoBox() {
	const activeFilter = useMapStore((state) => state.activeFilter);

	return (
		<>
			<motion.div
				key='list'
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0 }}
				transition={{ duration: 0.2 }}
				className='fixed inset-x-0 bottom-0 z-10 p-5 border-2 rounded-lg lg:pt-12 lg:absolute max-h-[300px] lg:max-h-[90%] overflow-auto bg-white/80 lg:top-20 lg:left-5 lg:inset-x-auto lg:bottom-auto lg:max-w-md'
			>
				<React.Fragment>
					{React.createElement('div', {
						dangerouslySetInnerHTML: { __html: activeFilter.content },
					})}
				</React.Fragment>
			</motion.div>
		</>
	);
}

export default InfoBox;
