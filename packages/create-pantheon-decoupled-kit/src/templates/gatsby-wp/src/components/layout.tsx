import { Row } from '@pantheon-systems/react-kit/components/Row';
import Footer from './footer';
import Header from './header';

const Layout = ({
	isHomePage = false,
	children,
}: {
	isHomePage?: boolean;
	children: React.ReactNode;
}) => {
	return (
		<div
			className={'bg-white min-w-full w-full min-h-screen flex flex-col'}
			data-is-root-path={isHomePage}
		>
			<Row
				className="text-neutral-900 max-w-[1920px] mx-auto mb-auto"
				type="flex"
				flexOptions={{ direction: 'col' }}
			>
				<Header />
				<main className="mb-auto mx-auto">{children}</main>
			</Row>
			<Footer />
		</div>
	);
};

export default Layout;
