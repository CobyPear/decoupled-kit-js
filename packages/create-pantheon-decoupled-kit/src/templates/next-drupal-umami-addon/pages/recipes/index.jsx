import { sortDate } from '@pantheon-systems/nextjs-kit';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { isMultiLanguage } from '../../lib/isMultiLanguage';
import {
	getCurrentLocaleStore,
	globalDrupalStateStores,
} from '../../lib/stores';

import { withGrid } from '@pantheon-systems/nextjs-kit';
import Layout from '../../components/layout';
import PageHeader from '../../components/page-header';
import { RecipeGridItem } from '../../components/recipeGridItem';

export default function RecipeListTemplate({
	sortedRecipes,
	navItems,
	hrefLang,
	multiLanguage,
}) {
	const { locale } = useRouter();
	const RecipeGrid = withGrid(RecipeGridItem);

	return (
		<Layout footerMenu={navItems} mainNavItems={navItems}>
			<NextSeo
				title="Decoupled Next Drupal Demo"
				description="Generated by create next app."
				languageAlternates={hrefLang || false}
			/>
			<PageHeader title="Recipes" />
			<section>
				<RecipeGrid
					data={sortedRecipes}
					contentType="recipes"
					multiLanguage={multiLanguage}
					locale={locale}
				/>
			</section>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	const origin = process.env.NEXT_PUBLIC_FRONTEND_URL;
	const { locales, locale } = context;
	const multiLanguage = isMultiLanguage(locales);

	const hrefLang = locales.map((locale) => {
		return {
			hrefLang: locale,
			href: origin + '/' + locale,
		};
	});

	const store = getCurrentLocaleStore(locale, globalDrupalStateStores);

	try {
		const recipes = await store.getObject({
			objectName: 'node--recipe',
			params:
				'include=field_media_image.field_media_image,field_recipe_category',
			refresh: true,
			res: context.res,
			anon: true,
		});

		const navItems = await store.getObject({
			objectName: 'menu_items--main',
			refresh: true,
			res: context.res,
			anon: true,
		});

		if (!recipes) {
			throw new Error(
				'No recipes returned. Make sure the objectName and params are valid!',
			);
		}

		const sortedRecipes = sortDate({
			data: recipes,
			key: 'created',
			direction: 'desc',
		});

		return {
			props: {
				sortedRecipes,
				navItems,
				hrefLang,
				multiLanguage,
			},
		};
	} catch (error) {
		console.error('Unable to fetch data for recipes: ', error);
		return {
			notFound: true,
		};
	}
}
