import chalk from 'chalk';
import inquirer from 'inquirer';
import minimist from 'minimist';
// import nodePlop, { CustomActionFunction, NodePlopAPI } from 'node-plop';
// import { getPartials } from './utils/getPartials';
// import { addWithDiff } from './actions/addWithDiff';
// import { runInstall } from './actions/runInstall';
// import { runESLint } from './actions/runESLint';
// import { pkgNameHelper } from './utils/handlebars';
import { helpMenu } from './utils/helpMenu';
import type { Answers, QuestionCollection } from 'inquirer';
import type { ParsedArgs, Opts as MinimistOptions } from 'minimist';
// import type { DecoupledKitGenerator } from './types';
import { decoupledKitGenerators } from './generators';
import { DecoupledKitGenerator } from './types';
import { actionRunner } from './utils/actionRunner';
import pkg from '../package.json' assert { type: 'json' };
import { getHandlebarsInstance } from './utils/handlebars';
const rootDir = new URL('.', import.meta.url).pathname;

const hbs = await getHandlebarsInstance(rootDir);

//console.log(hbs);

console.log('generators', decoupledKitGenerators);

// decoupledKitGenerators.forEach((generator) => {});

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

const getGeneratorList = (
	generators: DecoupledKitGenerator<{ [key: string]: string }, unknown>[],
) => {
	return generators.map(({ name }: { name: string }) => ({ name }));
};

const getGenerator = (generatorName: string) => {
	return decoupledKitGenerators.find(
		({ name }) => name === generatorName,
	) as DecoupledKitGenerator<{ [key: string]: string }, unknown>;
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
	DecoupledKitGenerators: DecoupledKitGenerator<
		{ [key: string]: any },
		unknown
	>[],
): Promise<void> => {
	// get a list of generators to map against positional arguments from the cli
	const generators = getGeneratorList(DecoupledKitGenerators);
	// take positional params from minimist args and
	// parse them for matching generator names
	const foundGenerators = args._.filter((arg) => {
		if (
			generators.find(({ name }) => {
				return arg.toString() === name.toString();
			})
		) {
			return arg;
		}
		args.silent ||
			console.log(chalk.yellow(`No generator found with name ${arg}.`));
		return;
	});

	if (args['help'] || args['h']) {
		return console.log(helpMenu);
	}

	if (args['v'] || args['version']) {
		return console.log(`v${pkg.version}`);
	}

	// remove the positional parameters
	const generatorsToRun = [];
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

	const actions = [];
	const templates = [];
	for (const g of generatorsToRun) {
		// use instance of plop and get the current generator
		const generator = getGenerator(g);
		// use inquirer directly for prompts because node-plop does not
		// play nicely with ParsedArgs and inquirer does <3
		const answers: Answers = await inquirer.prompt(
			generator.prompts as QuestionCollection,
			args,
		);
		// Add any prompts to args so we don't ask the same
		// prompt twice
		Object.assign(args, answers);

		// gather all actions and templates
		actions.push(...generator.actions);
		templates.push(...generator.templates);
		// use the harvested answers (if any) to run the plop actions
		// aka the meat of the generators
		// const { changes, failures } = await generator.runActions(answers);
		// if (failures.length) {
		// 	args.silent ||
		// 		failures.forEach(({ error }) => console.error(chalk.red(error)));
		// }
		// if (changes.length) {
		// 	args.silent ||
		// 		changes.forEach(({ type, path }) =>
		// 			console.log(chalk.green(type), chalk.cyan(path)),
		// 		);
		// }
	}

	await actionRunner({ actions, templates });
};
await main(
	parseArgs(),
	decoupledKitGenerators as DecoupledKitGenerator<
		{ [key: string]: any },
		unknown
	>[],
);
