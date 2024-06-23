import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql/error';
import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { Rating } from 'enums/rating.enum';
import { HelmetProvider as CustomHelmetProvider } from 'providers/HelmetProvider';
import { createMockState } from 'setupTests';

import { ItemDetailView } from '../ItemDetailView';
import { readItemQuery } from '../queries/readItemQuery';

const mockItemId = '636e2a7d27fe63c9179fcb6e';

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
                path: '/itemDetailView/:itemId',
                element: (
                    <MockedProvider mocks={mockGraphQL} addTypename={false}>
                        <RecoilRoot initializeState={mockState}>
                            <ItemDetailView />
                        </RecoilRoot>
                    </MockedProvider>
                ),
            },
            {
                path: '/itemDetailEdit/:itemId',
                element: <>Item Detail Edit</>,
            },
        ],
        {
            initialEntries: [`/itemDetailView/${mockItemId}`],
            initialIndex: 1,
        }
    );
    return router;
};

const mockGraphQLTemplate = {
    request: {
        query: readItemQuery,
        variables: {
            id: mockItemId,
        },
    },
    result: {
        data: {
            readItem: {
                artist: 'artist #1',
                descriptionLong: 'descriptionLong #1',
                descriptionShort: 'descriptionShort #1',
                id: mockItemId,
                publicId: 'publicId #1',
                rating: Rating.MEDIUM,
                regiments: 'regiment #1; regiment #2',
                tags: ['France', 'Infantry'],
                title: 'title #1',
                yearFrom: '1800',
                yearTo: '1850',
            },
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

describe('ItemDetailView...', () => {
    it('should render successfully', async () => {
        runRender();

        const title = await screen.findByText('title #1');
        expect(title).toBeInTheDocument();

        const year = screen.getByText('Year:');
        expect(year).toBeInTheDocument();
        const yearFrom = screen.getByText('1800');
        expect(yearFrom).toBeInTheDocument();
        const yearTo = screen.getByText('- 1850');
        expect(yearTo).toBeInTheDocument();

        const editButton = screen.getByRole('button', { name: 'edit' });
        expect(editButton).toBeInTheDocument();

        const deleteButton = screen.getByRole('button', { name: 'delete' });
        expect(deleteButton).toBeInTheDocument();
    });

    it('should go to ItemDetailEdit when Edit clicked', async () => {
        const { router } = runRender();

        const user = userEvent.setup();
        const button = await screen.findByRole('button', { name: 'edit' });

        await user.click(button);

        // screen.debug(undefined, 30000000);

        await waitFor(() => {
            expect(router.state.location.pathname).toEqual(
                `/itemDetailEdit/${mockItemId}`
            );
        });
    });

    it('should show confirmation when Delete clicked', async () => {
        runRender();

        const user = userEvent.setup();

        const button = await screen.findByRole('button', { name: 'delete' });

        await user.click(button);

        // screen.debug(undefined, 30000000);

        expect(await screen.findByText(/Are you sure?/i)).toBeInTheDocument();
    });

    it('should handle a network error when reading Item', async () => {
        runRender({ error: new Error('Network Error') });
        // screen.debug(undefined, 30000000);

        expect(await screen.findByText(/Network Error/i)).toBeInTheDocument();
    });

    it('should handle a GraphQL error when reading Item', async () => {
        runRender({
            result: {
                errors: [new GraphQLError('GraphQL Error')],
            },
        });

        expect(await screen.findByText(/GraphQL error/i)).toBeInTheDocument();

        // screen.debug(undefined, 30000000);
    });
});
