import { SpyInstance } from 'vitest';
import type { Answers, QuestionCollection } from 'inquirer';
import type { ParsedArgs } from 'minimist';
declare module 'vitest' {
	export interface TestContext {
		[key: string]: SpyInstance;
	}
}

/**
 * Input from command line arguments and/or prompts
 */
export type Input = ParsedArgs & Answers;

type DataMember = string | number | boolean;
type DataRecord = {
	[key: string]: DataMember | Record<string, DataRecord>;
};

/**
 * Generators need prompts to get user data not provided by CLI arguments
 */
export interface DecoupledKitGenerator<Prompts extends Answers> {
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
	 * An array of actions to run with the prompts and templates
	 */
	actions: Action[];
	/**
	 * Any extra data that should be passed from the generator to the actions
	 */
	data?: DataRecord;
	/**
	 * Set to true if the generator is considered an addon.
	 * This will give priority to the templates when de-duping.
	 */
	addon?: boolean;
}

export type Action = ({
	data,
	templates,
}: {
	data: Input;
	templates: string[];
}) => Promise<string> | string;

// TODO: what will the action runner look like?
// shape of actions may determine this
// it should pool all action configs, dedupe templates,
// and run actions in the most efficient order.
export type ActionRunner = ({
	actions,
	templates,
	data,
}: {
	actions: Action[];
	data: Input;
	templates: string[];
}) => Promise<string>;

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

// TYPE PREDICATES

/**
 * @param arg a variable
 * @returns true if the variable is a string, false otherwise
 */
export const isString = (arg: unknown): arg is string => {
	if (typeof arg === 'string') {
		return true;
	}
	return false;
};
