import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql/error';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { ArtistsList } from '../ArtistsList';

import { createMockState } from 'setupTests';
import { readArtistCountsQuery } from '../queries/readArtistCountsQuery';

interface MockMemoryRouterProps {
  mockGraphQL: any[];
  mockState: any; //TODO fix this
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
    ],
    {
      initialEntries: [`/artists`],
      initialIndex: 1,
    }
  );
  return router;
};

describe('ArtistList', () => {
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

    const router = setupRouter({ mockGraphQL, mockState });
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

    const router = setupRouter({ mockGraphQL, mockState });
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

    const router = setupRouter({ mockGraphQL, mockState });
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

    const router = setupRouter({ mockGraphQL, mockState });
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

    const router = setupRouter({ mockGraphQL, mockState });
    render(<RouterProvider router={router} />);

    // screen.debug();

    expect(await screen.findByText('GraphQL Error')).toBeInTheDocument();
  });
});
