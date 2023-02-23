import { addWithDiff, runLint } from '../actions';
import type { DecoupledKitGenerator } from '../types';

interface UmamiAddonAnswers {
	outDir: string;
}
export const nextDrupalUmamiAddon: DecoupledKitGenerator<UmamiAddonAnswers> = {
	name: 'next-drupal-umami-addon',
	description:
		"Drupal's Umami profile data and components add-on for the next-drupal starter",
	prompts: [
		{
			name: 'outDir',
			message: 'Where should the output go?',
			default: `${process.cwd()}/umami-demo`,
		},
	],
	addon: true,
	data: {
		ignorePattern: 'test',
		plugins: 'test234',
	},
	templates: ['next-drupal-umami-addon'],
	actions: [addWithDiff, runLint],
};
