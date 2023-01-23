import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ActionEnum, FilterDrawer } from '../FilterDrawer';
import { AppContext, AppContextType } from 'AppContext';
import { Tag } from 'types';

describe('FilterDraw', () => {
  let mockAppContextValue: AppContextType;

  beforeEach(() => {
    mockAppContextValue = {
      includeUnknownYear: false,
      isFilterOpen: true,
      ratings: { high: false, medium: false, low: false },
      setIncludeUnknownYear: (() => {}) as Function,
      setIsFilterOpen: (() => {}) as Function,
      setRatings: (() => {}) as Function,
      setTags: (() => {}) as Function,
      setYearRange: (() => {}) as Function,
      tags: [] as Tag[],
      yearRange: [] as number[],
    } as AppContextType;
  });

  it('should handle Search button click', async () => {
    const mockHandleAction = jest.fn(() => {});

    render(
      <AppContext.Provider value={mockAppContextValue}>
        <FilterDrawer onActionSelect={mockHandleAction} />
      </AppContext.Provider>
    );

    const searchButton = screen.getByText('Search');
    await userEvent.click(searchButton);

    expect(mockHandleAction).toBeCalledWith(ActionEnum.Search);
  });

  it('should render Nation tags', async () => {
    const mockHandleAction = jest.fn(() => {});
    mockAppContextValue.tags = [
      { group: 'Nation', isSelected: true, name: 'Anhalt' } as Tag,
    ];

    render(
      <AppContext.Provider value={mockAppContextValue}>
        <FilterDrawer onActionSelect={mockHandleAction} />
      </AppContext.Provider>
    );

    const nationTag = screen.getByText('Anhalt');
    expect(nationTag).toBeInTheDocument();
  });

  it('should render Type tags', async () => {
    const mockHandleAction = jest.fn(() => {});
    mockAppContextValue.tags = [
      { group: 'Type', isSelected: true, name: 'Infantry' } as Tag,
    ];

    render(
      <AppContext.Provider value={mockAppContextValue}>
        <FilterDrawer onActionSelect={mockHandleAction} />
      </AppContext.Provider>
    );

    const typeTag = screen.getByText('Infantry');
    expect(typeTag).toBeInTheDocument();
  });

  it('should render SubType tags', async () => {
    const mockHandleAction = jest.fn(() => {});
    mockAppContextValue.tags = [
      { group: 'SubType', isSelected: true, name: 'Hussar' } as Tag,
    ];

    render(
      <AppContext.Provider value={mockAppContextValue}>
        <FilterDrawer onActionSelect={mockHandleAction} />
      </AppContext.Provider>
    );

    const subTypeTag = screen.getByText('Hussar');
    expect(subTypeTag).toBeInTheDocument();
  });

  it('should render High Ratings', async () => {
    const mockHandleAction = jest.fn(() => {});
    mockAppContextValue.ratings = { high: true, medium: false, low: false };

    render(
      <AppContext.Provider value={mockAppContextValue}>
        <FilterDrawer onActionSelect={mockHandleAction} />
      </AppContext.Provider>
    );

    const checkBoxHigh = screen.getByLabelText('High') as HTMLInputElement;
    const checkBoxMedium = screen.getByLabelText('Medium') as HTMLInputElement;
    const checkBoxLow = screen.getByLabelText('Low') as HTMLInputElement;
    expect(checkBoxHigh.checked).toEqual(true);
    expect(checkBoxMedium.checked).toEqual(false);
    expect(checkBoxLow.checked).toEqual(false);
  });

  it('should render Medium Ratings', async () => {
    const mockHandleAction = jest.fn(() => {});
    mockAppContextValue.ratings = { high: false, medium: true, low: false };

    render(
      <AppContext.Provider value={mockAppContextValue}>
        <FilterDrawer onActionSelect={mockHandleAction} />
      </AppContext.Provider>
    );

    const checkBoxHigh = screen.getByLabelText('High') as HTMLInputElement;
    const checkBoxMedium = screen.getByLabelText('Medium') as HTMLInputElement;
    const checkBoxLow = screen.getByLabelText('Low') as HTMLInputElement;
    expect(checkBoxHigh.checked).toEqual(false);
    expect(checkBoxMedium.checked).toEqual(true);
    expect(checkBoxLow.checked).toEqual(false);
  });

  it('should render Low Ratings', async () => {
    const mockHandleAction = jest.fn(() => {});
    mockAppContextValue.ratings = { high: false, medium: false, low: true };

    render(
      <AppContext.Provider value={mockAppContextValue}>
        <FilterDrawer onActionSelect={mockHandleAction} />
      </AppContext.Provider>
    );

    const checkBoxHigh = screen.getByLabelText('High') as HTMLInputElement;
    const checkBoxMedium = screen.getByLabelText('Medium') as HTMLInputElement;
    const checkBoxLow = screen.getByLabelText('Low') as HTMLInputElement;
    expect(checkBoxHigh.checked).toEqual(false);
    expect(checkBoxMedium.checked).toEqual(false);
    expect(checkBoxLow.checked).toEqual(true);
  });

  it('should render Year Range', async () => {
    const mockHandleAction = jest.fn(() => {});
    mockAppContextValue.yearRange = [1770, 1820];

    render(
      <AppContext.Provider value={mockAppContextValue}>
        <FilterDrawer onActionSelect={mockHandleAction} />
      </AppContext.Provider>
    );

    const yearRange = screen.getByTestId('year-range');
    expect(yearRange.textContent).toEqual('1770 - 1820');
  });
});
