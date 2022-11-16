import { NextSeo } from 'next-seo';
import {
	setEdgeHeader,
	addSurrogateKeyHeader,
} from '@pantheon-systems/wordpress-kit';
import { ContentWithImage } from '@pantheon-systems/nextjs-kit';

import Layout from '../../components/layout';

import { getFooterMenu } from '../../lib/Menus';
import { getPostByUri, getPostPreview } from '../../lib/Posts';
import { getSurrogateKeys } from '../../lib/getSurrogateKeys';

export default function PostTemplate({ menuItems, post }) {
	return (
		<Layout footerMenu={menuItems}>
			<NextSeo
				title="Decoupled Next WordPress Demo"
				description="Generated by create next app."
			/>
			<ContentWithImage
				title={post.title}
				content={post.content}
				date={new Date(post.date).toLocaleDateString('en-US', {
					timeZone: 'UTC',
				})}
				imageProps={
					post.featuredImage
						? {
								src: post.featuredImage?.node.sourceUrl,
								alt: post.featuredImage?.node.altText,
						  }
						: undefined
				}
				contentClassName="ps-wp-content"
			/>
		</Layout>
	);
}

export async function getServerSideProps({
	params: { slug },
	res,
	preview,
	previewData,
}) {
	const { menuItems, menuItemHeaders } = await getFooterMenu();
	const { post, headers = false } = preview
		? await getPostPreview(previewData.key)
		: await getPostByUri(slug);

	if (!post) {
		return {
			notFound: true,
		};
	}

	const keys =
		headers && getSurrogateKeys({ headers: [menuItemHeaders, headers] });
	!preview && addSurrogateKeyHeader(keys, res);
	setEdgeHeader({ res });

	return {
		props: {
			menuItems,
			post,
		},
	};
}
