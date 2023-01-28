import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { ItemDetailAdd } from '../ItemDetailAdd';
import { createItemMutation } from '../queries/createItemMutation';
import { AppContext, AppContextType } from 'AppContext';
import { NavigationTag, Tag } from 'types';
import { GraphQLError } from 'graphql/error';

describe('ItemDetailAdd', () => {
  let mockAppContextValue: AppContextType;

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

  beforeAll(() => {
    console.error = jest.fn();

    mockAppContextValue = {
      includeUnknownYear: false,
      isFilterOpen: true,
      navigationTags: [] as NavigationTag[],
      ratings: { high: false, medium: false, low: false },
      setHeaderTitle: (() => {}) as Function,
      setIncludeUnknownYear: (() => {}) as Function,
      setIsFilterOpen: (() => {}) as Function,
      setNavigationTags: (() => {}) as Function,
      setRatings: (() => {}) as Function,
      setTags: (() => {}) as Function,
      setYearRange: (() => {}) as Function,
      tags: [
        {
          group: 'Nation',
          isSelected: false,
          name: 'France',
        },
      ] as Tag[],
      yearRange: [] as number[],
    } as AppContextType;
  });

  const setupRouter = (mockGraphQL: any) => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <>Home page</>,
        },
        {
          path: '/itemDetailAdd',
          element: (
            <MockedProvider mocks={[mockGraphQL]} addTypename={false}>
              <AppContext.Provider value={mockAppContextValue}>
                <ItemDetailAdd />
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
        initialEntries: ['/itemDetailAdd'],
        initialIndex: 1,
      }
    );
    return router;
  };

  it('should render successfully', async () => {
    const mockGraphQL = {
      ...mockGraphQLTemplate,
    };

    const router = setupRouter(mockGraphQL);

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
    const mockGraphQL = {
      ...mockGraphQLTemplate,
    };

    const router = setupRouter(mockGraphQL);

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
    const mockGraphQL = {
      ...mockGraphQLTemplate,
    };

    const router = setupRouter(mockGraphQL);

    render(<RouterProvider router={router} />);

    const user = userEvent.setup();

    const button = screen.getByRole('button', { name: 'cancel' });

    await user.click(button);

    // screen.debug(undefined, 30000000);

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/');
    });
  });

  it('should handle a network error', async () => {
    const mockGraphQL = {
      ...mockGraphQLTemplate,

      error: new Error('Network Error'),
    };

    const router = setupRouter(mockGraphQL);

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

  it('should handle a GraphQL error', async () => {
    const mockGraphQL = {
      ...mockGraphQLTemplate,

      result: {
        errors: [new GraphQLError('GraphQL Error')],
      },
    };

    const router = setupRouter(mockGraphQL);

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
});
