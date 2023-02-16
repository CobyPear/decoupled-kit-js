// import path from 'path';
import chalk from 'chalk';
import { ParsedArgs } from 'minimist';
import type { ActionRunner } from '../types';

export const actionRunner: ActionRunner = async ({
	actions,
	templates,
	data,
}) => {
	// const actionsPath = path.resolve('..', 'actions');
	actions = [...new Set(actions)];
	console.debug('actions', actions);
	console.debug('templates:', templates);
	console.debug('data:', data);

	try {
		for await (const action of actions) {
			console.debug('action:', action, await action({ data, templates }));
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			// const fn = await import(`${actionsPath}/${action}.ts`);
		}
		return '';
	} catch (error) {
		console.log(chalk.red('Something went wrong'));
		console.error(error);
		throw error;
	}
};
