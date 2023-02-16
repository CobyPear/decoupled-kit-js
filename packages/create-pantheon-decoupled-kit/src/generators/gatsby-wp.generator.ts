import { addWithDiff, runInstall, runLint } from '../actions';
import type { DecoupledKitGenerator, BaseConfig } from '../types';
import type { LintConfig } from '../actions/runLint';
import type { AddWithDiffConfig } from '../actions/addWithDiff';
import whichPmRuns from 'which-pm-runs';

interface GatsbyWPAnswers {
	appName: string;
	outDir: string;
}

export const gatsbyWp: DecoupledKitGenerator<
	GatsbyWPAnswers,
	[AddWithDiffConfig, BaseConfig, LintConfig]
> = {
	name: 'gatsby-wp',
	description: 'Gatsby + WordPress starter kit',
	prompts: [
		{
			name: 'appName',
			message: 'What is the name of your project?',
			default: 'Gatsby WordPress Starter',
		},
		{
			name: 'outDir',
			message: 'Where should the output go?',
			default: ({ appName }: { [key: string]: string }) =>
				`${process.cwd()}/${appName.replaceAll(' ', '-').toLowerCase()}`,
		},
	],
	templates: ['./templates/gatsby-wp'],
	actions: [addWithDiff, runInstall, runLint],

	// actions: (data) => {
	// 	const pnpm = whichPmRuns()?.name === 'pnpm' ? true : false;
	// 	if (data) {
	// 		data.gatsbyPnpmPlugin = pnpm;
	// 	}
	// 	const addWithDiff: CustomActionConfig<'addWithDiff'> = {
	// 		type: 'addWithDiff',
	// 		templates: './templates/gatsby-wp',
	// 		path: '{{outDir}}',
	// 		force: data?.force ? Boolean(data.force) : false,
	// 	};
	// 	const runESLint: CustomActionConfig<'runLint'> = {
	// 		type: 'runLint',
	// 		ignorePattern: data?.ignorePattern
	// 			? String(data.ignorePattern)
	// 			: undefined,
	// 		plugins: data?.plugins ? String(data.plugins) : undefined,
	// 	};
	// 	const runInstall: CustomActionConfig<'runInstall'> = {
	// 		type: 'runInstall',
	// 	};

	// 	const actions = [addWithDiff, runInstall, runESLint];

	// 	return actions;
	// },
};
