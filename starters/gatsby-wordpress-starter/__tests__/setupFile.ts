import { vi } from 'vitest'
import React from 'react'

vi.mock(`gatsby`, async () => {
	const gatsby = await vi.importActual<typeof import('gatsby')>(`gatsby`)

	return {
		...gatsby,
		graphql: vi.fn(),
		Link: vi.fn().mockImplementation(({ to, ...rest }) =>
			React.createElement(`a`, {
				...rest,
				href: to,
			}),
		),
		StaticQuery: vi.fn(),
	}
})
