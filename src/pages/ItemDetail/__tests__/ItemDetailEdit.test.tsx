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

import { ItemDetailEdit } from '../ItemDetailEdit';
import { readItemQuery } from '../queries/readItemQuery';
import { updateItemMutation } from '../queries/updateItemMutation';

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
                path: `/itemDetailEdit/:itemId`,
                element: (
                    <MockedProvider mocks={mockGraphQL} addTypename={false}>
                        <RecoilRoot initializeState={mockState}>
                            <ItemDetailEdit />
                        </RecoilRoot>
                    </MockedProvider>
                ),
            },
            {
                path: '/itemDetailView/:itemId',
                element: <>Item Detail View</>,
            },
        ],
        {
            initialEntries: [`/itemDetailEdit/${mockItemId}`],
            initialIndex: 1,
        }
    );
    return router;
};

const mockGraphQLReadTemplate = {
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

const mockGraphQLUpdateTemplate = {
    request: {
        query: updateItemMutation,
        variables: {
            artist: 'artist #1',
            descriptionLong: 'descriptionLong #1',
            descriptionShort: 'descriptionShort #1',
            id: mockItemId,
            rating: 3,
            publicId: 'publicId #1',
            regiments: 'regiment #1; regiment #2',
            tags: ['France', 'Infantry'],
            title: 'title #1 more',
            yearFrom: '1800',
            yearTo: '1850',
        },
    },
    result: () => {
        // N.B. Can add logging here.
        return {
            data: {
                updateItem: mockItemId,
            },
        };
    },
};

const mockState = createMockState({});

const runRender = (
    additionalReadMockGraphQLParams?: any,
    additionalUpdateMockGraphQLParams?: any
) => {
    const mockGraphQL = [
        { ...mockGraphQLReadTemplate, ...additionalReadMockGraphQLParams },
        { ...mockGraphQLUpdateTemplate, ...additionalUpdateMockGraphQLParams },
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

describe('ItemDetailEdit...', () => {
    it('should render successfully', async () => {
        runRender();

        const user = userEvent.setup();

        const title = await screen.findByLabelText('Title');
        expect(title).toBeInTheDocument();

        const button = screen.getByRole('button', { name: 'save' });
        expect(button).toBeDisabled();

        await user.type(title, 'title');
        await user.tab();

        expect(button).toBeEnabled();
    });

    it('should go to ItemDetailView when Save clicked', async () => {
        const { router } = runRender();

        const title = await screen.findByLabelText('Title');
        const saveButton = screen.getByRole('button', { name: 'save' });

        const user = userEvent.setup();
        await user.type(title, ' more');
        await user.tab();
        await user.click(saveButton);

        // screen.debug(undefined, 30000000);

        await waitFor(() => {
            expect(router.state.location.pathname).toEqual(
                `/itemDetailView/${mockItemId}`
            );
        });
    });

    it('should go to ItemDetailView when Cancel clicked', async () => {
        const { router } = runRender();

        // Wait for content to load...
        await screen.findByLabelText('Title');

        const cancelButton = screen.getByRole('button', { name: 'cancel' });

        const user = userEvent.setup();

        await user.click(cancelButton);

        // screen.debug(undefined, 30000000);

        await waitFor(() => {
            expect(router.state.location.pathname).toEqual(
                `/itemDetailView/${mockItemId}`
            );
        });
    });

    it('should handle a network error when reading item', async () => {
        runRender({ error: new Error('Network Error') });

        expect(await screen.findByText(/Network Error/i)).toBeInTheDocument();
    });

    it('should handle a GraphQL error when reading Item', async () => {
        runRender({
            result: {
                errors: [new GraphQLError('GraphQL Error')],
            },
        });
        // screen.debug(undefined, 30000000);

        expect(await screen.findByText(/GraphQL Error/i)).toBeInTheDocument();
    });

    it('should handle a network error when updating Item', async () => {
        runRender(
            {},
            {
                error: () => {
                    throw new Error('Network Error');
                },
            }
        );

        const title = await screen.findByLabelText('Title');
        const saveButton = screen.getByRole('button', { name: 'save' });

        const user = userEvent.setup();
        await user.type(title, ' more');
        await user.click(saveButton);

        // screen.debug(undefined, 30000000);

        expect(
            await screen.findByText(/Unable to update item. Please try again./i)
        ).toBeInTheDocument();
    });

    it('should handle a GraphQL error when updating Item', async () => {
        runRender(
            {},
            {
                result: {
                    errors: [new GraphQLError('GraphQL Error')],
                },
            }
        );

        const title = await screen.findByLabelText('Title');
        const saveButton = screen.getByRole('button', { name: 'save' });

        const user = userEvent.setup();
        await user.type(title, ' more');
        await user.click(saveButton);

        // screen.debug(undefined, 30000000);

        expect(
            await screen.findByText(/Unable to update item. Please try again./i)
        ).toBeInTheDocument();
    });
});
