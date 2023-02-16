// import path from 'path';
import type { Action, ActionsTuple } from '../types';

export const actionRunner = async <Configs>({
	actions,
	templates,
}: {
	actions: Action<ActionsTuple<[Configs]>>[];
	templates: string[];
}) => {
	// const actionsPath = path.resolve('..', 'actions');
	actions = [...new Set(actions)];
	console.debug('actions', actions);
	console.debug('templates:', templates);

	for await (const action of actions) {
		console.debug('action:', action);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		// const fn = await import(`${actionsPath}/${action}.ts`);
	}

	return '';
};
