import { addWithDiff, runInstall, runLint } from '../actions';
import type { DecoupledKitGenerator } from '../types';

interface NextWPAnswers {
	appName: string;
	outDir: string;
}

export const nextWp: DecoupledKitGenerator<NextWPAnswers> = {
	name: 'next-wp',
	description: 'Next.js + WordPress starter kit',
	prompts: [
		{
			name: 'appName',
			message: 'What is the name of your project?',
			default: 'Next WordPress Starter',
		},
		{
			name: 'outDir',
			message: 'Where should the output go?',
			default: ({ appName }: { [key: string]: string }) =>
				`${process.cwd()}/${appName.replaceAll(' ', '-').toLowerCase()}`,
		},
	],
	templates: ['templates/next-wp'],
	actions: [addWithDiff, runInstall, runLint],
};

// const addWithDiff: CustomActionConfig<'addWithDiff'> = {
// 	type: 'addWithDiff',
// 	templates: './templates/next-wp',
// 	path: '{{outDir}}',
// 	force: data?.force ? Boolean(data.force) : false,
// };
// const runESLint: CustomActionConfig<'runLint'> = {
// 	type: 'runLint',
// };
// const runInstall: CustomActionConfig<'runInstall'> = {
// 	type: 'runInstall',
// };

// const actions = [addWithDiff, runInstall, runESLint];

// return actions;
