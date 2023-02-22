// TODO: This file will have some funky types until
// the generators are ported over.
import chalk from 'chalk';
import inquirer from 'inquirer';
import minimist from 'minimist';
import nodePlop, { CustomActionFunction, NodePlopAPI } from 'node-plop';
import { getPartials } from './utils/getPartials';
import { addWithDiff } from './actions/addWithDiff';
import { runInstall } from './actions/runInstall';
import { runESLint } from './actions/runESLint';
import { helpMenu } from './utils/helpMenu';
import { getHandlebarsInstance } from './utils';
import type { Answers, QuestionCollection } from 'inquirer';
import type { ParsedArgs, Opts as MinimistOptions } from 'minimist';
import type { DecoupledKitGenerator } from './types';
import pkg from '../package.json' assert { type: 'json' };

const __filename = new URL('.', import.meta.url).pathname;

// unknown for now, until generators are refactored
const getGeneratorList = (generators: unknown) => {
	// temporary type coercion
	return (generators as { name: string }[]).map(
		({ name }: { name: string }) => ({ name }),
	);
};

const getGenerator = ({
	generatorName,
	decoupledKitGenerators,
}: {
	generatorName: string;
	// TODO: temporary type, use proper type when porting in
	// generators
	decoupledKitGenerators: { [key: string]: string }[];
}) => {
	return (
		decoupledKitGenerators.find(({ name }) => name === generatorName) || ''
	);
};

/**
 *  Parses CLI arguments using `minimist`
 * @see {@link https://www.npmjs.com/package/minimist#var-argv--parseargsargs-opts}
 * @param cliArgs - an array of strings.
 * @defaultValue `process.argv.slice(2)`
 */
export const parseArgs = (
	cliArgs: string[] = process.argv.slice(2),
): ParsedArgs => {
	// parse any command line arguments passed into the create command
	// to pass to the generator prompts and skip them.
	// useful for CI and testing purposes
	const options: MinimistOptions = {
		// these options tell minimist which --args are
		// booleans and which are strings.
		boolean: ['force', 'silent', 'help', 'h', 'version', 'v'],
		string: ['appName', 'outDir'],
	};
	const args: ParsedArgs = minimist(cliArgs, options);

	return args;
};

/**
 * Initializes the CLI prompts based on parsed arguments
 * @param args - {@link minimist.ParsedArgs}
 * @param DecoupledKitGenerators - An array of plop Generators with an added name field. @see {@link DecoupledKitGenerator}.
 * @remarks positional args are assumed to be generator names. Multiple generators can be queued up this way. Any number of prompts may be skipped by passing in the prompt name via flag.
 * @returns Runs the actions for the generators given as positional params or if none are found, prompts user to select valid generator from list of DecoupledKitGenerators
 */
export const main = async (
	args: ParsedArgs,
	decoupledKitGenerators: unknown,
): Promise<void> => {
	if (args['help'] || args['h']) {
		return console.log(helpMenu);
	}
	if (args['version'] || args['v']) {
		return console.log(`v${pkg.version}`);
	}

	// get a list of generators to map against positional arguments from the cli
	const generators = getGeneratorList(decoupledKitGenerators);
	// take positional params from minimist args and
	// check them against valid generators
	const foundGenerators = args._.filter((arg) => {
		if (generators.find(({ name }) => arg === name)) {
			return arg;
		}
		args.silent ||
			console.log(chalk.yellow(`No generator found with name ${arg}.`));
		return;
	});

	const generatorsToRun: string[] = [];

	// If no generators are found in positional params
	// ask which generators should be run
	if (!foundGenerators.length) {
		const generatorNames = generators.map(({ name }) => name);
		const whichGenerators: QuestionCollection<{ generators: string[] }> = {
			name: 'generators',
			type: 'checkbox',
			message: 'Which generator(s) would you like to run?',
			choices: () => generatorNames,
		};
		const answers = await inquirer.prompt(whichGenerators);
		if (Array.isArray(answers?.generators)) {
			generatorsToRun.push(...answers.generators);
			args._.push(...answers.generators);
		}
	} else {
		generatorsToRun.push(...foundGenerators);
	}

	if (!generatorsToRun.length) {
		args.silent ||
			console.error(
				chalk.red(
					'No generators were selected. Use positional arguments or choose from the prompt.',
				),
			);
	}

	for (const g of generatorsToRun) {
		const generator = getGenerator(g);
		const answers: Answers = await inquirer.prompt(
			generator.prompts as QuestionCollection,
			args,
		);

		Object.assign(args, answers);
		// use the harvested answers (if any) to run the plop actions
		// aka the meat of the generators
		const { changes, failures } = await plopGenerator.runActions(answers);
		if (failures.length) {
			args.silent ||
				failures.forEach(({ error }) => console.error(chalk.red(error)));
		}
		if (changes.length) {
			args.silent ||
				changes.forEach(({ type, path }) =>
					console.log(chalk.green(type), chalk.cyan(path)),
				);
		}
	}
};
