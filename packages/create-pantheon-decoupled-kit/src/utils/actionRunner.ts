// import path from 'path';
import chalk from 'chalk';
import type { ActionRunner } from '../types';

export const actionRunner: ActionRunner = async ({
	actions,
	templateData,
	data,
	handlebars,
}) => {
	// remove duplicate actions
	actions = [...new Set(actions)];
	// run each action sequentially
	try {
		for await (const action of actions) {
			const result = await action({ data, templateData, handlebars });
			console.log(result);
		}
		return 'Actions successfully completed.';
	} catch (error) {
		console.log(chalk.red('Something went wrong: '));
		console.error(error);
		throw error;
	}
};
