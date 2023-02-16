import { addWithDiff, runLint } from '../actions';
import type { DecoupledKitGenerator } from '../types';
import type { LintConfig } from '../actions/runLint';
import type { AddWithDiffConfig } from '../actions/addWithDiff';

interface UmamiAddonAnswers {
	outDir: string;
}
export const nextDrupalUmamiAddon: DecoupledKitGenerator<
	UmamiAddonAnswers,
	[AddWithDiffConfig, LintConfig]
> = {
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
	templates: ['./templates/next-drupal-umami-addon'],
	actions: [addWithDiff, runLint],
	// actions: (data) => {
	// 	const addWithDiff: CustomActionConfig<'addWithDiff'> = {
	// 		type: 'addWithDiff',
	// 		templates: './templates/next-drupal-umami-addon',
	// 		path: '{{outDir}}',
	// 		force: data?.force ? Boolean(data.force) : false,
	// 	};
	// 	const runESLint: CustomActionConfig<'runLint'> = {
	// 		type: 'runLint',
	// 	};

	// 	const actions = [addWithDiff, runESLint];

	// 	return actions;
	// },
};
