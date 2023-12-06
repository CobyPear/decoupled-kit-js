import { globalHistory } from '@gatsbyjs/reach-router';
import { Button } from '@pantheon-systems/react-kit/components/Button';
import { Header as ReactKitHeader } from '@pantheon-systems/react-kit/components/Header';
import { graphql, Link, useStaticQuery } from 'gatsby';
import { useEffect, useState } from 'react';

const Header = () => {
	const menuQuery = useStaticQuery<Queries.MenuQueryQuery>(graphql`
		query MenuQuery {
			wpMenu(name: { eq: "Example Menu" }) {
				id
				menuItems {
					nodes {
						id
						path
						label
					}
				}
			}
		}
	`);
	const navItems = menuQuery?.wpMenu?.menuItems?.nodes
		? menuQuery.wpMenu.menuItems.nodes
		: [];

	const [isOpen, setIsOpen] = useState(false);
	const handleOpen = () => setIsOpen((prev) => !prev);

	useEffect(() => {
		globalHistory.listen(({ action }) => {
			if (action === 'PUSH') {
				setIsOpen(false);
			}
		});
		return () => {
			globalHistory.listen(() => {});
		};
	}, [setIsOpen]);

	const mainNavItems = navItems?.map(({ path, label }) => ({
		linkText: label,
		href: `/posts${path}`,
	}));

	const secondaryNavItems = (
		<>
			<li className="mb-8 mr-auto lg:mb-0 lg:ml-auto lg:mr-0" key="docs">
				<Button
					Element="a"
					href="https://decoupledkit.pantheon.io"
					type="secondary"
				>
					Docs
				</Button>
			</li>
			<li className="mr-auto lg:mx-3 lg:mr-0" key="examples">
				<Button asChild>
					<Link to="/examples">Examples</Link>
				</Button>
			</li>
		</>
	);

	return (
		<ReactKitHeader
			linkComponent={Link}
			mainNavItems={mainNavItems}
			overlayStyles={'bg-white'}
			className="max-w-[1920px] w-full mx-auto"
			secondaryNavItems={secondaryNavItems}
			mobileNavHandler={[isOpen, handleOpen]}
			Logo={{
				src: '/pantheon-fist-blk.svg',
				href: '/',
				alt: 'Pantheon Logo',
			}}
		/>
	);
};

export default Header;
