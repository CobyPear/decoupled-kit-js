import { addWithDiff, runLint } from '../actions';
import type { DecoupledKitGenerator } from '../types';

interface GatsbyWPACFAnswers {
	outDir: string;
}

export const gatsbyWpAcfAddon: DecoupledKitGenerator<GatsbyWPACFAnswers> = {
	name: 'gatsby-wp-acf-addon',
	description:
		'Example implementation of the WordPress Advanced Custom Fields plugin for the gatsby-wordpress starter',
	prompts: [
		{
			name: 'outDir',
			message: 'Where should the output go?',
			default: `${process.cwd()}/gatsby-wp-acf-addon`,
		},
	],
	templates: ['gatsby-wp-acf-addon'],
	actions: [addWithDiff, runLint],
};
