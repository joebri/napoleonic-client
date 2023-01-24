import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { CloudConfig, CloudinaryImage } from '@cloudinary/url-gen';

import { ItemCard } from '../ItemCard';
import { AppContext, AppContextType } from 'AppContext';
import { Item, ItemMetaData, Tag } from 'types';
import { Rating } from 'enums/rating.enum';
import * as imageServiceModule from 'hooks/useImageService';

describe('ItemCard', () => {
  let routerHistory: any;
  let mockApolloClient: ApolloClient<NormalizedCacheObject>;
  let mockAppContextValue: AppContextType;
  let mockItem: Item;

  beforeAll(() => {
    routerHistory = createMemoryHistory({ initialEntries: ['/'] });

    mockApolloClient = new ApolloClient({
      uri: '',
      cache: new InMemoryCache(),
    });

    mockAppContextValue = {
      includeUnknownYear: false,
      isFilterOpen: true,
      ratings: { high: false, medium: false, low: false },
      setIncludeUnknownYear: (() => {}) as Function,
      setIsFilterOpen: (() => {}) as Function,
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

    mockItem = {
      artist: 'artist #1',
      descriptionLong: 'descriptionLong #1',
      descriptionShort: 'descriptionShort #1',
      id: '123456',
      publicId: 'publicId #1',
      rating: Rating.MEDIUM,
      regiments: 'regiment #1; regiment #2',
      tags: ['France', 'Infantry'],
      title: 'title #1',
      yearFrom: '1800',
      yearTo: '1850',
    };
  });

  it('should render Item details', async () => {
    const { container } = render(
      <Router location={routerHistory.location} navigator={routerHistory}>
        <ApolloProvider client={mockApolloClient}>
          <AppContext.Provider value={mockAppContextValue}>
            <ItemCard item={mockItem} />
          </AppContext.Provider>
        </ApolloProvider>
      </Router>
    );

    // screen.debug();

    const titleElements = container.getElementsByClassName(
      'MuiCardHeader-title'
    );
    expect(titleElements[0].textContent).toEqual('title #1');

    const subHeaderElements = container.getElementsByClassName(
      'MuiCardHeader-subheader'
    );
    expect(subHeaderElements[0].textContent).toEqual('descriptionShort #1');

    const image = screen.getByRole('img', { name: 'publicId #1' });
    expect(image).toBeInTheDocument();

    const nationality = screen.getByText('Nationality:', {
      exact: false,
    }).textContent;
    expect(nationality).toEqual('Nationality: France');

    const regiments = screen.getByText('Regiment(s):', {
      exact: false,
    }).textContent;
    expect(regiments).toEqual('Regiment(s): regiment #1; regiment #2');

    const years = screen.getByText('Year:', { exact: false }).textContent;
    expect(years).toEqual('Year: 1800 - 1850');

    const tags = screen.getByLabelText('Tags: France, Infantry');
    expect(tags).toBeInTheDocument();

    const rating = screen.getByRole('img', { name: '2 Stars' });
    expect(rating).toBeInTheDocument();
  });

  it('should open menu and handle view click', async () => {
    render(
      <Router location={routerHistory.location} navigator={routerHistory}>
        <ApolloProvider client={mockApolloClient}>
          <AppContext.Provider value={mockAppContextValue}>
            <ItemCard item={mockItem} />
          </AppContext.Provider>
        </ApolloProvider>
      </Router>
    );

    // screen.debug();

    const button = screen.getByRole('button', { name: 'settings' });
    await userEvent.click(button);
    const menu = screen.getByTestId('menu');
    expect(menu).toBeInTheDocument();

    const menuItems = screen.getAllByRole('menuitem');
    await userEvent.click(menuItems[0]);

    expect(routerHistory.location.pathname).toEqual('/itemDetailView/123456');
  });

  it('should open menu and handle edit click', async () => {
    render(
      <Router location={routerHistory.location} navigator={routerHistory}>
        <ApolloProvider client={mockApolloClient}>
          <AppContext.Provider value={mockAppContextValue}>
            <ItemCard item={mockItem} />
          </AppContext.Provider>
        </ApolloProvider>
      </Router>
    );

    // screen.debug();

    const button = screen.getByRole('button', { name: 'settings' });
    await userEvent.click(button);
    const menu = screen.getByTestId('menu');
    expect(menu).toBeInTheDocument();

    const menuItems = screen.getAllByRole('menuitem');
    await userEvent.click(menuItems[1]);

    expect(routerHistory.location.pathname).toEqual('/itemDetailEdit/123456');
  });

  it('should open menu and handle metadata click', async () => {
    jest.spyOn(imageServiceModule, 'useImageService').mockImplementation(() => {
      return {
        getImage: (uri: string) => {
          const cloudConfig = new CloudConfig({
            cloudName: process.env.REACT_APP_CLOUDINARY_NAME,
          });
          const img = new CloudinaryImage(uri, cloudConfig);
          return img;
        },
        getMetaData: async (publicId: string): Promise<ItemMetaData> => {
          return new Promise((resolve) => {
            resolve({
              bytes: 1,
              height: 2,
              url: 'url',
              width: 3,
            } as ItemMetaData);
          });
        },
      };
    });

    render(
      <Router location={routerHistory.location} navigator={routerHistory}>
        <ApolloProvider client={mockApolloClient}>
          <AppContext.Provider value={mockAppContextValue}>
            <ItemCard item={mockItem} />
          </AppContext.Provider>
        </ApolloProvider>
      </Router>
    );

    const button = screen.getByRole('button', { name: 'settings' });
    await userEvent.click(button);
    const menu = screen.getByTestId('menu');
    expect(menu).toBeInTheDocument();

    const menuItems = screen.getAllByRole('menuitem');
    await userEvent.click(menuItems[2]);

    const metaDataLabel = screen.getByText('Height:');
    expect(metaDataLabel).toBeInTheDocument();
  });
});
