import path from 'path';
// import fs from 'fs';
import klaw from 'klaw';
import { Input } from '../types';
const rootDir = new URL('.', import.meta.url).pathname;
import type { TemplateData } from '../types';

interface Template {
	addon: boolean;
	template: string;
	base: string;
}

const getTemplateNames = async (
	templateDir: string,
	addon: boolean,
): Promise<Template[]> => {
	const result: Template[] = [];
	const base = path.basename(templateDir);
	for await (const file of klaw(
		path.resolve(rootDir, 'templates', templateDir),
	)) {
		if (file.stats.isDirectory()) continue;
		const tempObj: { addon: boolean; template: string; base: string } = {
			addon,
			base,
			template: '',
		};
		const templateName = file.path.split(templateDir)[1];
		tempObj.template = templateName;

		result.push(tempObj);
	}
	return result;
};

// TODO: This needs some work, but I think it's the last piece of the puzzle.
// might be worth to clean up everything but addWithDiff for some initial review.
export const dedupeTemplates = async (
	templateData: TemplateData[],
	data: Input,
): Promise<string[]> => {
	console.debug('templateData in dedupeTemplates:', templateData);
	const allTemplates: Template[] = [];
	for (const { templateDirs, addon } of templateData) {
		for await (const dir of templateDirs) {
			const templates = await getTemplateNames(dir, addon);
			allTemplates.push(...templates);
		}
		// templateDirs.forEach(async (dir) => {
	}
	// const [allTemplates] = await Promise.all(
	// 	templates.map(async (templateDir) => {
	// 		let addon: boolean;
	// 		if ('addons' in data) {
	// 			addon = data?.addons.some((x: string) => x === templateDir);
	// 		}
	// 		return await getTemplateNames(templateDir, addon);
	// 		// console.debug('addon boolean in templates.map:', addon);
	// 	}),
	// );
	console.log('allTemplates: ', allTemplates);
	// need an array of objects with { addon: boolean, template: string, base: string }
	// where template is the path to the template without the base name
	// and base is the templateDir
	const mergeTemplatePaths = (
		unmergedTemplates: {
			addon: boolean;
			template: string;
			base: string;
		}[],
	) => {
		const mergedPaths: { [key: string]: { addon: boolean; base: string } } = {};

		for (const { addon, template, base } of unmergedTemplates) {
			if (!mergedPaths[template]) {
				// set the template as the key and if it is an addon as the value
				mergedPaths[template] = { addon, base };
				// if we find the template already added to mergedPaths
				// and it is an addon
			} else if (mergedPaths[template] && !mergedPaths[template].addon) {
				// if the current template is an addon, set the base to that template
				delete mergedPaths[template];
				mergedPaths[template] = { base, addon };
				// mergedPaths[template].base = addon ? base : mergedPaths[template].base;
				// mergedPaths[template].addon = addon;
			}
		}
		return mergedPaths;

		// for (const templatePath of templateData) {
		// 	const priority = templatePath.addon ? true : false;
		// 	for (const template of templatePath.templates) {
		// 		if (!mergedPaths[template]) {
		// 			mergedPaths[template] = priority;
		// 		} else if (mergedPaths[template] === false && priority) {
		// 			mergedPaths[template] = true;
		// 		}
		// 	}
	};
	const dedupedTemplates = mergeTemplatePaths(allTemplates);
	console.log('dedupedTemplates: ', dedupedTemplates);
	console.log('deduped.length', Object.keys(dedupedTemplates).length);
	// allTemplates
	// 	.sort((a, b) => (a.addon ? -1 : b.addon ? -1 : 1))
	// 	.forEach(({ templates, base }) =>
	// 		templates.forEach((t) => sortedTemplates.push(`${base}${t}`)),
	// 	);

	// console.debug('sortedTemplates:', sortedTemplates);

	// const dedupedTemplates = sortedTemplates.map((template, i, templates) => {
	// 	if (template)
	// })
	// console.debug('dedupedTemplates:', dedupedTemplates);

	return [''];
};
