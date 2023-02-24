import { addWithDiff, runInstall, runLint } from '../actions';
import type { DecoupledKitGenerator, DefaultAnswers } from '../types';

interface NextWPAnswers extends DefaultAnswers {
	appName: string;
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
	templates: ['next-wp'],
	actions: [addWithDiff, runInstall, runLint],
};
