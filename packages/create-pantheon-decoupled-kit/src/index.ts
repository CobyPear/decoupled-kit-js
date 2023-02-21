import chalk from 'chalk';
import inquirer from 'inquirer';
import minimist from 'minimist';
import { helpMenu } from './utils/helpMenu';
import type { Answers, QuestionCollection } from 'inquirer';
import type { ParsedArgs, Opts as MinimistOptions } from 'minimist';
import type { TemplateData } from './types';
import { decoupledKitGenerators } from './generators';
import { DecoupledKitGenerator } from './types';
import { actionRunner } from './utils/actionRunner';
import pkg from '../package.json' assert { type: 'json' };
import { getHandlebarsInstance } from './utils/handlebars';
const rootDir = new URL('.', import.meta.url).pathname;

console.log('generators', decoupledKitGenerators);

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
		const templateObj: TemplateData = {
			templateDirs: [...generator.templates],
			addon: generator?.addon || false,
		};
		// if a generator is an addon, note it in an 'addons' section of the args
		// if (generator.addon) {
		// 	Array.isArray(args.addons)
		// 		? args.addons.push(generator.name)
		// 		: (args.addons = [generator.name]);
		// }

		// gather all actions and templates
		actions.push(...generator.actions);
		templateData.push(templateObj);
	}
	console.debug('data:', args);

	// pass the handlebars instance into data so it is available
	// to any action that needs it
	const hbs = await getHandlebarsInstance(rootDir);

	await actionRunner({
		actions,
		templateData,
		data: args,
		handlebars: hbs,
	});
};
await main(parseArgs(), decoupledKitGenerators);
