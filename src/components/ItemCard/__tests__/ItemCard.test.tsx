import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { MutableSnapshot, RecoilRoot } from 'recoil';

import { Rating } from 'enums/rating.enum';
// import * as imageServiceModule from 'hooks/useImageService';
import { createMockState } from 'setupTests';
import { Item } from 'types';

import { ItemCard } from '../ItemCard';

const mockItemId = '636e2a7d27fe63c9179fcb6e';

interface MockMemoryRouterProps {
  mockGraphQL: any[];
  mockItem: Item;
  mockState: ({ set }: MutableSnapshot) => void;
}

const setupRouter = ({
  mockGraphQL,
  mockItem,
  mockState,
}: MockMemoryRouterProps) => {
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
              <ItemCard item={mockItem} />
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

describe('ItemCard', () => {
  const mockState = createMockState({});

  let mockItem: Item = {
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
  };

  beforeAll(() => {});

  it('should render Item details', async () => {
    const mockGraphQL: any = [];
    const router = setupRouter({ mockState, mockGraphQL, mockItem });
    const { container } = render(<RouterProvider router={router} />);

    // screen.debug();

    const titleElements = container.getElementsByClassName(
      'MuiCardHeader-title'
    );
    expect(titleElements[0].textContent).toEqual('title #1');

    const subHeaderElements = container.getElementsByClassName(
      'MuiCardHeader-subheader'
    );
    expect(subHeaderElements[0].textContent).toEqual('descriptionShort #1');

    const image = screen.getByTitle('publicId #1');
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
    const mockGraphQL: any = [];
    const router = setupRouter({ mockState, mockGraphQL, mockItem });
    render(<RouterProvider router={router} />);

    // screen.debug();

    const button = screen.getByRole('button', { name: 'settings' });
    await userEvent.click(button);
    const menu = screen.getByTestId('menu');
    expect(menu).toBeInTheDocument();

    const menuItems = screen.getAllByRole('menuitem');
    await userEvent.click(menuItems[0]);

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(
        `/itemDetailView/${mockItemId}`
      );
    });
  });

  it('should open menu and handle edit click', async () => {
    const mockGraphQL: any = [];
    const router = setupRouter({ mockState, mockGraphQL, mockItem });
    render(<RouterProvider router={router} />);

    // screen.debug();

    const button = screen.getByRole('button', { name: 'settings' });
    await userEvent.click(button);
    const menu = screen.getByTestId('menu');
    expect(menu).toBeInTheDocument();

    const menuItems = screen.getAllByRole('menuitem');
    await userEvent.click(menuItems[1]);

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(
        `/itemDetailEdit/${mockItemId}`
      );
    });
  });

  //TODO refactor this to mock an image
  // it('should open menu and handle metadata click', async () => {
  //   jest.spyOn(imageServiceModule, 'useImageService').mockImplementation(() => {
  //     return {
  //       getLocalImage: (path: string) => {
  //         return `url/${path}`;
  //       },
  //     };
  //   });

  //   const mockGraphQL: any = [];
  //   const router = setupRouter({ mockState, mockGraphQL, mockItem });
  //   render(<RouterProvider router={router} />);

  //   const button = screen.getByRole('button', { name: 'settings' });
  //   await userEvent.click(button);
  //   const menu = screen.getByTestId('menu');
  //   expect(menu).toBeInTheDocument();

  //   const menuItems = screen.getAllByRole('menuitem');
  //   await userEvent.click(menuItems[2]);

  //   console.log(menuItems[2]);

  //   screen.debug(menuItems);

  //   const metaDataLabel = screen.getByText('Height:');
  //   expect(metaDataLabel).toBeInTheDocument();
  // });
});
