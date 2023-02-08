import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql/error';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MutableSnapshot, RecoilRoot } from 'recoil';

import { BattlesList } from '../BattlesList';

import { createMockState } from 'setupTests';
import { readBattleCountsQuery } from '../queries/readBattleCountsQuery';

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
        path: `/battles`,
        element: (
          <MockedProvider mocks={mockGraphQL} addTypename={false}>
            <RecoilRoot initializeState={mockState}>
              <BattlesList />
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
      initialEntries: [`/battles`],
      initialIndex: 1,
    }
  );
  return router;
};

describe('BattlesList', () => {
  const mockGraphQLTemplate = {
    request: {
      query: readBattleCountsQuery,
      variables: {
        ratings: [],
      },
    },
    result: {
      data: {
        readBattleCounts: [
          { name: 'battle 1', count: 1 },
          { name: 'battle 2', count: 2 },
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
    expect(await screen.findByText('battle 1 (1)')).toBeInTheDocument();
    expect(await screen.findByText('battle 2 (2)')).toBeInTheDocument();

    const button = screen.getByRole('button', { name: 'search' });
    expect(button).toBeDisabled();
  });

  it('should enable Search button when a Battle clicked', async () => {
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
    const battleChip = await screen.findByText('battle 1 (1)');
    await user.click(battleChip);

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
    const battleChip = await screen.findByText('battle 1 (1)');
    await user.click(battleChip);
    await user.click(searchButton);

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(`/gallery`);
    });
    expect(router.state.location.search).toEqual(`?battles=battle%201`);
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
