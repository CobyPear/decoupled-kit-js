import { PaginatorLocation } from '../../lib/types';
import { PageGrid } from '../components/grid';
import Layout from '../components/layout';
import Paginator from '../components/paginator';
import Seo from '../components/seo';

const PageIndexTemplate = ({
	pageContext: { pages, routing, itemsPerPage },
	location,
}: {
	pageContext: {
		pages: Queries.WpPageEdge[];
		routing: boolean;
		itemsPerPage: number;
	};
	location: PaginatorLocation;
}) => {
	const RenderCurrentItems = ({
		currentItems,
	}: {
		currentItems: Queries.WpPage[];
	}) => {
		return <PageGrid data={currentItems} contentType="pages" />;
	};

	return (
		<Layout>
			<header className="mt-12 text-center">
				<h1 className="font-extrabold text-6xl">Pages</h1>
			</header>
			<div>
				<section>
					<Paginator
						data={pages.map(({ node }) => node)}
						itemsPerPage={itemsPerPage}
						location={location}
						routing={routing}
						Component={RenderCurrentItems}
					/>
				</section>
			</div>
		</Layout>
	);
};

export default PageIndexTemplate;

export function Head() {
	return <Seo title="Pages" description="All pages" />;
}
