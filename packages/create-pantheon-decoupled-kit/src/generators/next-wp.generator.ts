import { addWithDiff, runInstall, runLint } from '../actions';
import type { LintConfig } from '../actions/runLint';
import type { AddWithDiffConfig } from '../actions/addWithDiff';
import type { DecoupledKitGenerator, BaseConfig } from '../types';

interface NextWPAnswers {
	appName: string;
	outDir: string;
}

export const nextWp: DecoupledKitGenerator<
	NextWPAnswers,
	[AddWithDiffConfig, BaseConfig, LintConfig]
> = {
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
	templates: ['./templates/next-wp'],
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
