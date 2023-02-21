import { addWithDiff, runInstall, runLint } from '../actions';
import type { DecoupledKitGenerator } from '../types';

interface NextDrupalAnswers {
	appName: string;
	outDir: string;
}
export const nextDrupal: DecoupledKitGenerator<NextDrupalAnswers> = {
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
	templates: ['next-drupal'],
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
