import path from 'path';
import { BaseConfig, DecoupledKitGenerator } from '../types';
export const dedupeTemplates = (
	config: Pick<DecoupledKitGenerator<BaseConfig>, 'templates' | 'addon'>[],
): string[] => {
	config.forEach(({ templates, addon }) => {
		console.debug('templates:', templates);
		console.debug('addon:', addon);
	});

	return [''];
};
