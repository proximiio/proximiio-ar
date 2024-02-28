import { FilterCategoryModel } from '@/models/filterItem.model';
import { KioskModel } from '@/models/kiosk.model';
import { PiCoffee } from 'react-icons/pi';
import { PiTShirtLight } from 'react-icons/pi';
import { PiShoppingCart } from 'react-icons/pi';
import { PiForkKnife } from 'react-icons/pi';
import { PiBoot } from 'react-icons/pi';
import { PiToilet } from 'react-icons/pi';
import { PiWheelchair } from 'react-icons/pi';
import { PiBaby } from 'react-icons/pi';
import { PiStethoscope } from 'react-icons/pi';
import { PiMoney } from 'react-icons/pi';

export const filterCategories: FilterCategoryModel[] = [
	{
		title: 'shops',
		colorVariant: 'primary',
		items: [
			{
				title: 'cafes',
				icon: PiCoffee,
				id: '44010f6f-9963-4433-ad86-40b89b829c41:c693d414-4613-4c6c-95da-771e52759873',
				type: 'list',
			},
			{
				title: 'clothing',
				icon: PiTShirtLight,
				id: '44010f6f-9963-4433-ad86-40b89b829c41:d111c5e4-1a63-48b3-94de-5fa7b309daaf',
				type: 'list',
			},
			{
				title: 'groceries',
				icon: PiShoppingCart,
				id: '44010f6f-9963-4433-ad86-40b89b829c41:da5435e2-9179-4ca6-86e4-652b7e8d109b',
				type: 'list',
			},
			{
				title: 'restaurant',
				icon: PiForkKnife,
				id: '44010f6f-9963-4433-ad86-40b89b829c41:c96e80d7-6683-4ca0-bc64-b6ed3fc824e2',
				type: 'list',
			},
			{
				title: 'shoes',
				icon: PiBoot,
				id: '44010f6f-9963-4433-ad86-40b89b829c41:f62dd757-4057-4015-97a0-c66d8934f7d8',
				type: 'list',
			},
		],
	},
	{
		title: 'showTheClosest',
		colorVariant: 'secondary',
		items: [
			{
				title: 'toilet',
				icon: PiToilet,
				id: '44010f6f-9963-4433-ad86-40b89b829c41:e762ea14-70e2-49b7-9938-f6870f9ab18f',
				type: 'closest',
			},
			{
				title: 'accessible-toilet',
				icon: PiWheelchair,
				id: '44010f6f-9963-4433-ad86-40b89b829c41:61042c8a-87a3-40e4-afa8-3a2c3c09fbf8',
				type: 'closest',
			},
			{
				title: 'baby-changing',
				icon: PiBaby,
				id: '44010f6f-9963-4433-ad86-40b89b829c41:62c605cc-75c0-449a-987c-3bdfef2c1642',
				type: 'closest',
			},
			{
				title: 'emergency-care',
				icon: PiStethoscope,
				id: '44010f6f-9963-4433-ad86-40b89b829c41:57ef933b-ff2e-4db1-bc99-d21f2053abb2',
				type: 'closest',
			},
			{
				title: 'atm',
				icon: PiMoney,
				id: '44010f6f-9963-4433-ad86-40b89b829c41:2cd016a5-8703-417c-af07-d49aef074ad3',
				type: 'closest',
			}
		],
	},
];

export const kiosks: KioskModel[] = [
	{
		name: 'kiosk',
		latitude: 25.21620020891565,
		longitude: 55.40792571152656,
		level: 0,
		pitch: 40,
		bearing: 10,
		zoom: 18,
		poiId:
			'75698d35-0918-4a2b-a8ab-77b93a618e61:c2f3d327-d2ee-4d6f-a14f-2a85dfb1ab8d',
	},
	{
		name: 'kiosk1',
		latitude: 25.33766469,
		longitude: 51.4814541,
		level: 0,
		pitch: 0,
		bearing: 179.2,
		zoom: 18,
		bounds: [
			[51.478472777, 25.336273415],
			[51.482695283, 25.338782543],
		],
	},
	{
		name: 'kiosk2',
		latitude: 25.33687709,
		longitude: 51.4814541,
		level: 2,
		pitch: 0,
		bearing: -91.2,
		zoom: 17,
		bounds: [
			[51.479646637, 25.335341258],
			[51.482528207, 25.339278794],
		],
	},
	{
		name: 'entrance',
		poiId:
			'44010f6f-9963-4433-ad86-40b89b829c41:9b8fea62-ef62-4598-8e8e-deaaaf359f47',
	},
];
