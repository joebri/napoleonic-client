import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql/error';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { beforeAll, expect, it, vi } from 'vitest';

import { createMockState } from 'setupTests';

import { ItemDetailAdd } from '../ItemDetailAdd';
import { createItemMutation } from '../queries/createItemMutation';

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
                path: '/itemDetailAdd',
                element: (
                    <MockedProvider mocks={mockGraphQL} addTypename={false}>
                        <RecoilRoot initializeState={mockState}>
                            <ItemDetailAdd />
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
            initialEntries: ['/itemDetailAdd'],
            initialIndex: 1,
        }
    );
    return router;
};

const mockGraphQLTemplate = {
    request: {
        query: createItemMutation,
        variables: {
            artist: '',
            descriptionLong: '',
            descriptionShort: '',
            publicId: '',
            rating: 3,
            regiments: '',
            tags: [''],
            title: 'title',
            yearFrom: '',
            yearTo: '',
        },
    },
    result: {
        data: {
            createItem: '636e2a7d27fe63c9179fcb6e',
        },
    },
};

const mockState = createMockState({});

beforeAll(() => {
    console.error = vi.fn();
});

it('should render successfully', async () => {
    const mockGraphQL = [
        {
            ...mockGraphQLTemplate,
        },
    ];

    const router = setupRouter({ mockGraphQL, mockState });

    render(<RouterProvider router={router} />);

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
    const mockGraphQL = [
        {
            ...mockGraphQLTemplate,
        },
    ];

    const router = setupRouter({ mockGraphQL, mockState });

    render(<RouterProvider router={router} />);

    const user = userEvent.setup();

    const title = await screen.findByLabelText('Title');
    const button = screen.getByRole('button', { name: 'save' });

    await user.type(title, 'title');
    await user.tab();
    await user.click(button);

    // screen.debug(undefined, 30000000);

    await waitFor(() => {
        expect(router.state.location.pathname).toEqual(
            '/itemDetailView/636e2a7d27fe63c9179fcb6e'
        );
    });
});

it('should go to Gallery when Cancel clicked', async () => {
    const mockGraphQL = [
        {
            ...mockGraphQLTemplate,
        },
    ];

    const router = setupRouter({ mockGraphQL, mockState });

    render(<RouterProvider router={router} />);

    const user = userEvent.setup();

    const button = screen.getByRole('button', { name: 'cancel' });

    await user.click(button);

    // screen.debug(undefined, 30000000);

    await waitFor(() => {
        expect(router.state.location.pathname).toEqual('/gallery');
    });
});

it('should handle a network error when creating Item', async () => {
    const mockGraphQL = [
        {
            ...mockGraphQLTemplate,

            error: new Error('Network Error'),
        },
    ];

    const router = setupRouter({ mockGraphQL, mockState });

    render(<RouterProvider router={router} />);

    const user = userEvent.setup();

    const title = await screen.findByLabelText('Title');
    const button = screen.getByRole('button', { name: 'save' });

    await user.type(title, 'title');

    await user.click(button);

    // screen.debug(undefined, 30000000);

    expect(
        await screen.findByText(/Unable to create item. Please try again./i)
    ).toBeInTheDocument();
});

it('should handle a GraphQL error when creating Item', async () => {
    const mockGraphQL = [
        {
            ...mockGraphQLTemplate,
            result: {
                errors: [new GraphQLError('GraphQL Error')],
            },
        },
    ];

    const router = setupRouter({ mockGraphQL, mockState });

    render(<RouterProvider router={router} />);

    const user = userEvent.setup();

    const title = await screen.findByLabelText('Title');
    const button = screen.getByRole('button', { name: 'save' });

    await user.type(title, 'title');

    await user.click(button);

    // screen.debug(undefined, 30000000);

    expect(
        await screen.findByText(/Unable to create item. Please try again./i)
    ).toBeInTheDocument();
});
