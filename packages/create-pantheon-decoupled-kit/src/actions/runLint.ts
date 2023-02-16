/* eslint-disable @typescript-eslint/no-unused-vars */
import chalk from 'chalk';
import whichPmRuns from 'which-pm-runs';
import { execSync } from 'child_process';
import path from 'path';
import type { BaseConfig } from '../types';

export interface LintConfig extends BaseConfig {
	// noInstall: boolean;
	// noLint: boolean;
	ignorePattern: string;
	plugins: string;
}

export const runLint = async ({
	config: { data, ignorePattern, plugins },
}: {
	config: LintConfig;
}) => {
	if (data?.noInstall || data?.noLint) return 'skipping linting';
	if (!data.outDir || typeof data?.outDir !== 'string')
		throw 'fail: outDir required';
	data.silent || console.log(chalk.green('Linting...'));

	const getPkgManager = whichPmRuns();
	let command: string;
	if (!getPkgManager || getPkgManager.name === 'npm') {
		// fallback to npm
		command = 'npm run';
	} else {
		command = getPkgManager.name;
	}

	try {
		const pkgPath = path.resolve(`${data.outDir}/package.json`);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const { default: pkg } = await import(pkgPath, {
			assert: { type: 'json' },
		});
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (pkg?.scripts?.lint) {
			execSync(`${command} lint`, { cwd: data.outDir, stdio: 'inherit' });
		} else {
			execSync(
				`npx eslint ${
					ignorePattern ? `--ignore-pattern ${ignorePattern}` : ''
				} ${plugins ? `--plugin ${plugins}` : ''}`,
				{ cwd: data.outDir, stdio: 'inherit' },
			);
		}
	} catch (error) {
		console.error(error);
		throw 'fail: there was a problem linting';
	}
	return 'success';
};
