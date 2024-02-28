export interface FilterItemModel {
	title: string;
	icon?: string;
	iconImage?: string;
	id?: string | string[];
	type: 'list' | 'closest' | 'info';
	content?: string;
}

export interface FilterCategoryModel {
	title: string;
	colorVariant?: string;
	items: FilterItemModel[];
}