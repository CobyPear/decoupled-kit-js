import { setupServer } from 'msw/node';
import { rest } from 'msw';

import defaultApiIndex from './data/defaultProfileApiIndex.json';
import defaultArticles from './data/defaultProfileArticles.json';
import defaultPreview from './data/defaultProfilePreview.json';

import oauthToken from './data/oauthToken.json';

const defaultProfileHandlers = [
	{
		endpoint: 'https://default/jsonapi/',
		mockData: defaultApiIndex,
		method: 'get',
		status: 200,
	},
	{
		endpoint: 'https://default/jsonapi/node/article',
		mockData: defaultArticles,
		method: 'get',
		status: 200,
	},
	{
		endpoint: 'https://default/jsonapi/node/x',
		mockData: {},
		method: 'get',
		status: 200,
	},
	{
		endpoint:
			'https://default/jsonapi/decoupled-preview/1_d4b52b83-e92a-4a4f-b2de-647ecb9fb6d0',
		mockData: defaultPreview,
		method: 'get',
		status: 200,
	},
	{
		endpoint: 'https://default/jsonapi/decoupled-preview/xxxx',
		method: 'get',
		status: 404,
	},
	{
		endpoint: `https://default/oauth/token`,
		mockData: oauthToken,
		method: 'post',
		status: 200,
	},
];

//construct restHandlers
export const restHandlers = [...defaultProfileHandlers].map(
	({ endpoint, mockData, method, status }) => {
		return rest[method](endpoint, (req, res, ctx) => {
			return res(ctx.status(status), ctx.json(mockData));
		});
	},
);

process.env = {
	...process.env,
	// workaround – tests are not seeing locales as an array with react testing library 14 and latest vitest
	locales: ['en', 'es'],
	__NEXT_IMAGE_OPTS: {
		deviceSizes: [320, 420, 768, 1024, 1200],
		imageSizes: [],
		domains: ['default'],
		path: '/_next/image',
		loader: 'default',
	},
};

const server = setupServer(...restHandlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
