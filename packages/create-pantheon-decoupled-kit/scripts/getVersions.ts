import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
const rootDir = new URL('.', import.meta.url).pathname;
const pkgsPath = path.resolve(rootDir, '..', '..');

const outputObj = {};
fs.readdirSync(pkgsPath, 'utf-8').forEach((pkg) => {
	const pkgJsonPath = path.resolve(pkgsPath, pkg, 'package.json');
	try {
		const pkgJson = JSON.parse(
			fs.readFileSync(pkgJsonPath, 'utf-8'),
		) as unknown;
		let version;
		if (pkgJson && typeof pkgJson === 'object' && 'version' in pkgJson) {
			version = pkgJson.version;
		}
		if (!version) {
			console.error(`No version found for ${pkg}`);
			return;
		}
		Object.assign(outputObj, { [pkg]: version });
	} catch (error) {
		/** swallow the error if there is no pkg json */
	}
});

const outputPath = path.resolve(rootDir, '..', 'src', 'pkgVersions.json');
try {
	const output = JSON.stringify(outputObj, null, 2);
	fs.writeFileSync(outputPath, output);
	console.log(chalk.green('Versions updated:'));
	console.log(output);
} catch (error) {
	console.error(error);
}
