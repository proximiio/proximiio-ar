/* eslint-disable no-mixed-spaces-and-tabs */
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import Feature from 'proximiio-js-library/lib/models/feature';
import { LuChevronsRight } from 'react-icons/lu';
import { TbPennant } from 'react-icons/tb';
import { getFloorName } from '@/lib/utils';

import useMapStore from '@/store/mapStore';

interface StepModel {
	bearingFromLastStep: number;
	coordinates: { coordinates: [number, number] };
	direction: string;
	distanceFromLastStep: number;
	instruction?: string[];
	isWaypoint: boolean;
	level: number;
	levelChangerId: string;
	lineStringFeatureFromLastStep: Feature;
	waypointId: string;
	destinationLevel?: number;
	stepsUntil?: StepModel[];
	totalDistance?: number;
	description: string;
}

function PoiDetailsSteps() {
	const [steps, setSteps] = useState([] as StepModel[]);

	const map = useMapStore((state) => state.map);
	const haveRouteDetails = useMapStore((state) => state.haveRouteDetails);
	const routeDetails = useMapStore((state) => state.routeDetails);
	const floors = useMapStore((state) => state.floors);
	const currentFloor = useMapStore((state) => state.currentFloor);
	const currentLanguage = useMapStore((state) => state.currentLang);
	const currentStep = useMapStore((state) => state.currentStep);
	const setCurrentStep = useMapStore((state) => state.setCurrentStep);

	useEffect(() => {
		if (haveRouteDetails) {
			const textNavSteps: StepModel[] = routeDetails.TBTNav.steps;
			let previousIndex = 0;
			setSteps(
				textNavSteps
					.filter((i, index, array) => {
						// Get the first part of the direction string
						const direction = i.direction.split('_')[0];
						// Check if the current step is a level changer and has a valid direction or is finish
						if (
							(i.levelChangerId &&
								(direction === 'UP' || direction === 'DOWN')) ||
							i.direction === 'FINISH'
						) {
							i.stepsUntil = array.slice(previousIndex, index);
							previousIndex = index + 1;
							return i;
						}
					})
					.map((step) => {
						const direction = step.direction.split('_')[0]
							? step.direction.split('_')[0]
							: step.direction;
						const levelChangerType = step.direction.split('_')[1];
						const destinationFloor = floors.filter(
							(f) => f.level === step.destinationLevel
						)
							? floors.filter((f) => f.level === step.destinationLevel)[0]
							: currentFloor;

						const stepsUntilDistance = step.stepsUntil!.reduce(
							(total, item) => total + item.distanceFromLastStep,
							0
						);
						const totalDistance =
							step.distanceFromLastStep + stepsUntilDistance;

						let description;
						if (direction === 'FINISH') {
							description =
								currentLanguage === 'fi'
									? `${t('you-will-arrive')} ${totalDistance | 0}m ${t('in')}.`
									: `${t('in')} ${totalDistance | 0}m ${t('you-will-arrive')}.`;
						} else {
							description = `${t('go')} ${totalDistance | 0}m ${t(
								'and-take-the'
							)} ${t(levelChangerType)} ${t(direction)} ${t('TO_FLOOR')} ${
								destinationFloor.name
									? getFloorName({
											floor: destinationFloor,
											language: currentLanguage,
									  })
									: step.destinationLevel
							}.`;
						}

						return {
							...step,
							totalDistance,
							description,
							destinationFloor,
						};
					})
			);
		}
	}, [
		haveRouteDetails,
		routeDetails?.TBTNav?.steps,
		currentFloor,
		currentLanguage,
		floors,
	]);

	const nextStepHandler = () => {
		const lastStepIndex = steps.length - 1;

		if (currentStep !== lastStepIndex) {
			setCurrentStep(currentStep + 1);
			map.setNavStep(currentStep + 1);
		} else {
			setCurrentStep(0);
			map.setNavStep(0);
		}
	};

	return (
		<>
			{haveRouteDetails && (
				<div className='flex items-stretch lg:mb-4'>
					<div className='flex items-center flex-1 p-4 text-sm text-black rounded-l-lg bg-black/5'>
						{steps[currentStep]?.description}
					</div>
					<div
						className='flex flex-col justify-center p-2 text-lg text-center text-white transition-colors bg-black rounded-r-lg cursor-pointer lg:p-4 lg:text-4xl hover:bg-primary'
						onClick={nextStepHandler}
					>
						{currentStep !== steps.length - 1 ? (
							<LuChevronsRight className='mx-auto mb-1' />
						) : (
							<TbPennant className='mx-auto mb-1' />
						)}
						<p className='text-sm uppercase'>
							{currentStep !== steps.length - 1 ? t('next') : t('arrived')}
						</p>
					</div>
				</div>
			)}
		</>
	);
}

export default PoiDetailsSteps;
