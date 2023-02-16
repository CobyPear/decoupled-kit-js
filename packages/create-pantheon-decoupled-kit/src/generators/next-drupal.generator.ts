import type { CustomActionConfig } from 'node-plop';
import { addWithDiff, runInstall, runLint } from '../actions';
import type { DecoupledKitGenerator, BaseConfig } from '../types';
import type { LintConfig } from '../actions/runLint';
import type { AddWithDiffConfig } from '../actions/addWithDiff';

interface NextDrupalAnswers {
	appName: string;
	outDir: string;
}
export const nextDrupal: DecoupledKitGenerator<
	NextDrupalAnswers,
	[AddWithDiffConfig, BaseConfig, LintConfig]
> = {
	name: 'next-drupal',
	description: 'Next.js + Drupal starter kit',
	prompts: [
		{
			name: 'appName',
			message: 'What is the name of your project?',
			default: 'Next Drupal Starter',
		},
		{
			name: 'outDir',
			message: 'Where should the output go?',
			default: ({ appName }: { [key: string]: string }) =>
				`${process.cwd()}/${appName.replaceAll(' ', '-').toLowerCase()}`,
		},
	],
	templates: ['./templates/next-drupal'],
	actions: [addWithDiff, runInstall, runLint],
	// actions: (data) => {
	// 	const addWithDiff: CustomActionConfig<'addWithDiff'> = {
	// 		type: 'addWithDiff',
	// 		templates: './templates/next-drupal',
	// 		path: '{{outDir}}',
	// 		force: data?.force ? Boolean(data.force) : false,
	// 	};
	// 	const runESLint: CustomActionConfig<'runLint'> = {
	// 		type: 'runLint',
	// 	};
	// 	const runInstall: CustomActionConfig<'runInstall'> = {
	// 		type: 'runInstall',
	// 	};

	// 	const actions = [addWithDiff, runInstall, runESLint];

	// 	return actions;
	// },
};
