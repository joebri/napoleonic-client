import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql/error';
import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { HelmetProvider as CustomHelmetProvider } from 'providers/HelmetProvider';
import { createMockState } from 'setupTests';

import { ArtistsList } from '../ArtistsList';
import { readArtistCountsQuery } from '../queries/readArtistCountsQuery';

interface MockMemoryRouterProps {
    mockGraphQL: any[];
    mockState: ({ set }: MutableSnapshot) => void;
}

const setupRouter = ({ mockGraphQL, mockState }: MockMemoryRouterProps) => {
    const router = createMemoryRouter(
        [
            {
                path: '/',
                element: <>Home page</>,
            },
            {
                path: `/artists`,
                element: (
                    <MockedProvider mocks={mockGraphQL} addTypename={false}>
                        <RecoilRoot initializeState={mockState}>
                            <ArtistsList />
                        </RecoilRoot>
                    </MockedProvider>
                ),
            },
            {
                path: '/itemDetailView/:itemId',
                element: <>Item Detail View</>,
            },
            {
                path: '/gallery',
                element: <>Gallery</>,
            },
        ],
        {
            initialEntries: [`/artists`],
            initialIndex: 1,
        }
    );
    return router;
};

const mockGraphQLTemplate = {
    request: {
        query: readArtistCountsQuery,
        variables: {
            ratings: [],
            tags: [],
            yearRange: [],
            includeUnknownYear: false,
        },
    },
    result: {
        data: {
            readArtistCounts: [
                { name: 'name 1', count: 1 },
                { name: 'name 2', count: 2 },
            ],
        },
    },
};

const mockState = createMockState({});

const runRender = (additionalMockGraphQLParams?: any) => {
    const mockGraphQL = [
        {
            ...mockGraphQLTemplate,
            ...additionalMockGraphQLParams,
        },
    ];
    const router = setupRouter({ mockGraphQL, mockState });

    render(
        <HelmetProvider>
            <CustomHelmetProvider>
                <RouterProvider router={router} />
            </CustomHelmetProvider>
        </HelmetProvider>
    );

    return { router };
};

beforeAll(() => {
    console.error = vi.fn();
});

beforeEach(() => {});

describe('ArtistsList...', () => {
    it('should render successfully', async () => {
        runRender();

        // screen.debug();

        expect(await screen.findByText('Loading...')).toBeInTheDocument();
        expect(await screen.findByText('name 1 (1)')).toBeInTheDocument();
        expect(screen.getByText('name 2 (2)')).toBeInTheDocument();
    });

    it('should enable Search button when an Artist clicked', async () => {
        runRender();

        // screen.debug();

        const searchButton = await screen.findByRole('button', {
            name: 'search',
        });
        expect(searchButton).toBeDisabled();

        const user = userEvent.setup();
        const artistChip = await screen.findByText('name 1 (1)');
        await user.click(artistChip);

        expect(searchButton).toBeEnabled();
    });

    it('should go to Gallery when Search button clicked', async () => {
        const { router } = runRender();

        // screen.debug();
        const user = userEvent.setup();

        const searchButton = await screen.findByRole('button', {
            name: 'search',
        });
        const artistChip = await screen.findByText('name 1 (1)');
        await user.click(artistChip);
        await user.click(searchButton);

        await waitFor(() => {
            expect(router.state.location.pathname).toEqual(`/gallery`);
        });
        expect(router.state.location.search).toEqual(`?artists=name%201`);
    });

    it('should handle a network error', async () => {
        runRender({ error: new Error('Network Error') });

        // screen.debug();

        expect(await screen.findByText('Network Error')).toBeInTheDocument();
    });

    it('should handle a GraphQL error', async () => {
        runRender({
            result: {
                errors: [new GraphQLError('GraphQL Error')],
            },
        });

        // screen.debug();

        expect(await screen.findByText('GraphQL Error')).toBeInTheDocument();
    });
});
