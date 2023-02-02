import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import { ArtistsList } from '../ArtistsList';

import { AppContext, AppContextType } from 'AppContext';
import { GraphQLError } from 'graphql/error';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { mockAppContext } from 'setupTests';
import { readArtistCountsQuery } from '../queries/readArtistCountsQuery';
import userEvent from '@testing-library/user-event';

interface MockMemoryRouterProps {
  mockAppContextValue: AppContextType;
  mockGraphQL: any[];
}

const setupRouter = ({
  mockAppContextValue,
  mockGraphQL,
}: MockMemoryRouterProps) => {
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
            <AppContext.Provider value={mockAppContextValue}>
              <ArtistsList />
            </AppContext.Provider>
          </MockedProvider>
        ),
      },
      {
        path: '/itemDetailView/:itemId',
        element: <>Item Detail View</>,
      },
    ],
    {
      initialEntries: [`/artists`],
      initialIndex: 1,
    }
  );
  return router;
};

describe('ArtistList', () => {
  let mockAppContextValue: AppContextType = mockAppContext;

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

  beforeAll(() => {
    console.error = jest.fn();
  });

  beforeEach(() => {});

  it('should render successfully', async () => {
    const mockGraphQL = [
      {
        ...mockGraphQLTemplate,
      },
    ];

    const router = setupRouter({ mockAppContextValue, mockGraphQL });
    render(<RouterProvider router={router} />);

    // screen.debug();

    expect(await screen.findByText('Loading...')).toBeInTheDocument();
    expect(await screen.findByText('name 1 (1)')).toBeInTheDocument();
    expect(await screen.findByText('name 2 (2)')).toBeInTheDocument();
  });

  it('should enable Search button when an Artist clicked', async () => {
    const mockGraphQL = [
      {
        ...mockGraphQLTemplate,
      },
    ];

    const router = setupRouter({ mockAppContextValue, mockGraphQL });
    render(<RouterProvider router={router} />);

    // screen.debug();

    const searchButton = await screen.findByRole('button', { name: 'search' });
    expect(searchButton).toBeDisabled();

    const user = userEvent.setup();
    const artistChip = await screen.findByText('name 1 (1)');
    await user.click(artistChip);

    expect(searchButton).toBeEnabled();
  });

  it('should go to Gallery when Search button clicked', async () => {
    const mockGraphQL = [
      {
        ...mockGraphQLTemplate,
      },
    ];

    const router = setupRouter({ mockAppContextValue, mockGraphQL });
    render(<RouterProvider router={router} />);

    // screen.debug();
    const user = userEvent.setup();

    const searchButton = await screen.findByRole('button', { name: 'search' });
    const artistChip = await screen.findByText('name 1 (1)');
    await user.click(artistChip);
    await user.click(searchButton);

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(`/`);
    });
    expect(router.state.location.search).toEqual(`?artists=name%201`);
  });

  it('should handle a network error', async () => {
    const mockGraphQL = [
      {
        ...mockGraphQLTemplate,
        error: new Error('Network Error'),
      },
    ];

    const router = setupRouter({ mockAppContextValue, mockGraphQL });
    render(<RouterProvider router={router} />);

    // screen.debug();

    expect(await screen.findByText('Network Error')).toBeInTheDocument();
  });

  it('should handle a GraphQL error', async () => {
    const mockGraphQL = [
      {
        ...mockGraphQLTemplate,
        result: {
          errors: [new GraphQLError('GraphQL Error')],
        },
      },
    ];

    const router = setupRouter({ mockAppContextValue, mockGraphQL });
    render(<RouterProvider router={router} />);

    // screen.debug();

    expect(await screen.findByText('GraphQL Error')).toBeInTheDocument();
  });
});
