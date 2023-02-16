import { SpyInstance } from 'vitest';
import type { Answers, QuestionCollection } from 'inquirer';
import type { ParsedArgs } from 'minimist';
declare module 'vitest' {
	export interface TestContext {
		[key: string]: SpyInstance;
	}
}

/**
 * Minimum required config for an action.
 */
export interface BaseConfig {
	/**
	 * User provided input via prompts or command line arguments
	 */
	data: Answers | ParsedArgs;
	// /**
	//  *
	//  */
	// type: ActionType;
}

/**
 * Valid action types
 */
// export type ActionType = 'addWithDiff' | 'runInstall' | 'runLint';

export type ActionsTuple<Config extends unknown[]> = [
	...(Config extends BaseConfig ? Config : never),
];
/**
 * Generators need prompts to get user data not provided by CLI arguments,
 *  and a config to pass to the action runner.
 */
export interface DecoupledKitGenerator<Prompts extends Answers, Configs> {
	/**
	 * Generator's name. This should be kebab case.
	 */
	name: string;
	/**
	 * Description of the generator
	 */
	description: string;
	/**
	 * An array of inquirer prompts
	 */
	prompts: QuestionCollection<Prompts>[];
	/**
	 * An array of paths to the generator's templates.
	 * This should be empty if the generator does not have templates.
	 */
	templates: string[];
	/**
	 * An array of valid action types
	 */
	actions: Action<ActionsTuple<[Configs]>>[];
	/**
	 * Set to true if the generator is considered an addon.
	 * This will give priority to the templates when de-duping.
	 */
	addon?: boolean;
}

// TODO: what will the action runner look like?
// shape of actions may determine this
// it should pool all action configs, dedupe templates,
// and run actions in the most efficient order.
export type ActionRunner<Configs> = ({
	actions,
	configs,
}: {
	actions: Action<ActionsTuple<[Configs]>>[];
	configs: Configs[];
}) => Promise<string>;

export type Action<ActionConfig extends BaseConfig> = ({
	config,
}: {
	config: ActionConfig;
}) => Promise<string> | string;

// export type Action = () => Promise<string> | string;

// class stuff???
// abstract class Action {
// 	const config;
// 	constructor(config) {
// 		this.config=config
// 	}
// 	run: (config) => Promise<string> | string;
// }

// abstract class ActionFactory<Config extends BaseConfig> {
// 	create: (config: Config)
// }
