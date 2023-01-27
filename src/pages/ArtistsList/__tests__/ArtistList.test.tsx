import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

import { ArtistsList } from '../ArtistsList';
import { readArtistCountsQuery } from '../queries/readArtistCountsQuery';
import { AppContext, AppContextType } from 'AppContext';
import { Tag } from 'types';
import { GraphQLError } from 'graphql/error';

describe('ArtistList', () => {
  let routerHistory: any;
  let mockAppContextValue: AppContextType;

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

    routerHistory = createMemoryHistory({ initialEntries: ['/'] });

    mockAppContextValue = {
      includeUnknownYear: false,
      isFilterOpen: true,
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

  beforeEach(() => {});

  it('should render successfully', async () => {
    const mockGraphQL = {
      ...mockGraphQLTemplate,
    };

    render(
      <Router location={routerHistory.location} navigator={routerHistory}>
        <MockedProvider mocks={[mockGraphQL]} addTypename={false}>
          <AppContext.Provider value={mockAppContextValue}>
            <ArtistsList />
          </AppContext.Provider>
        </MockedProvider>
      </Router>
    );

    // screen.debug();

    expect(await screen.findByText('Loading...')).toBeInTheDocument();
    expect(await screen.findByText('name 1 (1)')).toBeInTheDocument();
    expect(await screen.findByText('name 2 (2)')).toBeInTheDocument();
  });

  it('should handle a network error', async () => {
    const mockGraphQL = {
      ...mockGraphQLTemplate,
      error: new Error('Network Error'),
    };

    render(
      <Router location={routerHistory.location} navigator={routerHistory}>
        <MockedProvider mocks={[mockGraphQL]} addTypename={false}>
          <AppContext.Provider value={mockAppContextValue}>
            <ArtistsList />
          </AppContext.Provider>
        </MockedProvider>
      </Router>
    );

    // debug();

    expect(await screen.findByText('Network Error')).toBeInTheDocument();
  });

  it('should handle a GraphQL error', async () => {
    const mockGraphQL = {
      ...mockGraphQLTemplate,
      result: {
        errors: [new GraphQLError('GraphQL Error')],
      },
    };

    render(
      <Router location={routerHistory.location} navigator={routerHistory}>
        <MockedProvider mocks={[mockGraphQL]} addTypename={false}>
          <AppContext.Provider value={mockAppContextValue}>
            <ArtistsList />
          </AppContext.Provider>
        </MockedProvider>
      </Router>
    );

    // screen.debug();

    expect(await screen.findByText('GraphQL Error')).toBeInTheDocument();
  });
});
