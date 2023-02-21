// import path from 'path';
import chalk from 'chalk';
import type { ActionRunner } from '../types';

export const actionRunner: ActionRunner = async ({
	actions,
	templateData,
	data,
	handlebars,
}) => {
	// const actionsPath = path.resolve('..', 'actions');
	actions = [...new Set(actions)];
	console.debug('actions', actions);
	console.debug('templateData:', templateData);
	console.debug('data:', data);
	// const templates = templateData.map(({ templateDirs }) => templateDirs);

	try {
		for await (const action of actions) {
			console.debug(
				'action:',
				action,
				await action({ data, templateData, handlebars }),
			);
		}
		return '';
	} catch (error) {
		console.log(chalk.red('Something went wrong'));
		console.error(error);
		throw error;
	}
};
