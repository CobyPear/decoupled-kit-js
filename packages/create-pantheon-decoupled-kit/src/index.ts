import chalk from 'chalk';
import inquirer, { Answers, QuestionCollection } from 'inquirer';
import minimist, { ParsedArgs, Opts as MinimistOptions } from 'minimist';
import { decoupledKitGenerators } from './generators';
import { helpMenu, actionRunner, getHandlebarsInstance } from './utils/index';
import type { DecoupledKitGenerator, TemplateData } from './types';

import pkg from '../package.json' assert { type: 'json' };
const rootDir = new URL('.', import.meta.url).pathname;

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
		boolean: ['force', 'silent'],
		string: ['appName', 'outDir'],
		alias: {
			help: ['h', 'help'],
			version: ['v', 'version'],
		},
	};
	const args: ParsedArgs = minimist(cliArgs, options);

	return args;
};

const getGeneratorList = (generators: typeof decoupledKitGenerators) => {
	return generators.map(({ name }: { name: string }) => ({ name }));
};

const getGenerator = (generatorName: string) => {
	return decoupledKitGenerators.find(
		({ name }) => name === generatorName,
	) as DecoupledKitGenerator<{ [key: string]: string }>;
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
	DecoupledKitGenerators: typeof decoupledKitGenerators,
): Promise<void | Error> => {
	// display the help menu
	if (args['help'] || args['h']) {
		return console.log(helpMenu(DecoupledKitGenerators));
	}

	// display the current version
	if (args['v'] || args['version']) {
		return console.log(`v${pkg.version}`);
	}

	// get a list of generators to map against positional arguments from the cli
	const generators = getGeneratorList(DecoupledKitGenerators);
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
		return new Error(
			chalk.red(
				'No generators were selected. Use positional arguments or choose from the prompt.',
			),
		);
	}

	const actions = [];
	const templateData: TemplateData[] = [];
	for (const g of generatorsToRun) {
		const generator = getGenerator(g);
		const answers: Answers = await inquirer.prompt(
			generator.prompts as QuestionCollection,
			args,
		);
		// Add any prompts to args object so we don't ask the same
		// prompt twice
		Object.assign(args, answers);
		// if generator data exists, add it to the args object
		generator.data && Object.assign(args, generator.data);

		// this object is used to deduplicate the templates
		const templateObj: TemplateData = {
			templateDirs: [...generator.templates],
			addon: generator?.addon || false,
		};

		// gather all actions and templates
		actions.push(...generator.actions);
		templateData.push(templateObj);
	}
	// pass the handlebars instance into data so it is available
	// to any action that needs it
	const hbs = await getHandlebarsInstance(rootDir);
	// run the actions
	await actionRunner({
		actions,
		templateData,
		data: args,
		handlebars: hbs,
	});
	args.silent ||
		console.log(
			chalk.bgGreen.black('Your project was generated with:'),
			`\n\t${chalk.cyan(args._.join('\n\t'))}`,
		);
	args.silent ||
		console.log(
			`${chalk.yellow('cd')} into ${chalk.bold.magenta(
				args.outDir,
			)} to start developing!`,
		);
};
