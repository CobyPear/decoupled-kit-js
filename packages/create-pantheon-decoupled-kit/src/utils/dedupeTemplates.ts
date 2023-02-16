import path from 'path';
// import fs from 'fs';
import klaw from 'klaw';
const rootDir = new URL('.', import.meta.url).pathname;

const getTemplateNames = async (
	templatesPath: string,
	addon: boolean,
): Promise<{ addon: boolean; templates: string[] }> => {
	const result: { addon: boolean; templates: string[] } = {
		addon,
		templates: [],
	};
	for await (const file of klaw(path.resolve(rootDir, templatesPath))) {
		if (file.stats.isDirectory()) continue;
		const templateName = file.path.split(templatesPath)[1];
		result.templates.push(templateName);
	}
	return result;
};

export const dedupeTemplates = async ({
	templates,
	addons,
}: {
	templates: string[];
	addons: string[];
}) => {
	console.debug('templates:', templates);
	console.debug('addons:', addons);
	const allTemplates = await Promise.all(
		templates.map(async (templatePath) => {
			const addon = addons.some((x) => x === path.basename(templatePath));
			console.debug('addon boolean in templates.map:', addon);

			return await getTemplateNames(templatePath, addon);
		}),
	);
	const sortedTemplates: string[] = [];
	allTemplates
		.sort((a, b) => (a.addon ? -1 : b.addon ? -1 : 1))
		.forEach(({ templates }) =>
			templates.forEach((t) => sortedTemplates.push(t)),
		);

	console.debug('sortedTemplates:', sortedTemplates);

	const dedupedTemplates = [...new Set(sortedTemplates)];
	console.debug('dedupedTemplates:', dedupedTemplates);

	return dedupeTemplates;
};
