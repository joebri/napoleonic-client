import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecoilRoot } from 'recoil';

import { createMockState } from 'setupTests';
import { Tag } from 'types';
import { ActionEnum, FilterDrawer } from '../FilterDrawer';

describe('FilterDraw', () => {
  beforeEach(() => {});

  it('should handle Search button click', async () => {
    const mockHandleAction = jest.fn(() => {});
    const mockState = createMockState({});

    render(
      <RecoilRoot initializeState={mockState}>
        <FilterDrawer onActionSelect={mockHandleAction} />
      </RecoilRoot>
    );

    const searchButton = await screen.findByText('Search');
    await userEvent.click(searchButton);

    expect(mockHandleAction).toBeCalledWith(ActionEnum.Search);
  });

  it('should render Nation tags', async () => {
    const mockHandleAction = jest.fn(() => {});
    const mockState = createMockState({
      tags: [{ group: 'Nation', isSelected: true, name: 'Anhalt' } as Tag],
    });

    render(
      <RecoilRoot initializeState={mockState}>
        <FilterDrawer onActionSelect={mockHandleAction} />
      </RecoilRoot>
    );

    const nationTag = await screen.findByText('Anhalt');
    expect(nationTag).toBeInTheDocument();
  });

  it('should render Type tags', async () => {
    const mockHandleAction = jest.fn(() => {});
    const mockState = createMockState({
      tags: [{ group: 'Type', isSelected: true, name: 'Infantry' } as Tag],
    });

    render(
      <RecoilRoot initializeState={mockState}>
        <FilterDrawer onActionSelect={mockHandleAction} />
      </RecoilRoot>
    );

    const typeTag = await screen.findByText('Infantry');
    expect(typeTag).toBeInTheDocument();
  });

  it('should render SubType tags', async () => {
    const mockHandleAction = jest.fn(() => {});
    const mockState = createMockState({
      tags: [{ group: 'SubType', isSelected: true, name: 'Hussar' } as Tag],
    });

    render(
      <RecoilRoot initializeState={mockState}>
        <FilterDrawer onActionSelect={mockHandleAction} />
      </RecoilRoot>
    );

    const subTypeTag = await screen.findByText('Hussar');
    expect(subTypeTag).toBeInTheDocument();
  });

  it('should render High Ratings', async () => {
    const mockHandleAction = jest.fn(() => {});
    const mockState = createMockState({
      ratings: { high: true, medium: false, low: false },
    });

    render(
      <RecoilRoot initializeState={mockState}>
        <FilterDrawer onActionSelect={mockHandleAction} />
      </RecoilRoot>
    );

    const checkBoxHigh = (await screen.findByLabelText(
      'High'
    )) as HTMLInputElement;
    const checkBoxMedium = screen.getByLabelText('Medium') as HTMLInputElement;
    const checkBoxLow = screen.getByLabelText('Low') as HTMLInputElement;
    expect(checkBoxHigh.checked).toEqual(true);
    expect(checkBoxMedium.checked).toEqual(false);
    expect(checkBoxLow.checked).toEqual(false);
  });

  it('should render Medium Ratings', async () => {
    const mockHandleAction = jest.fn(() => {});
    const mockState = createMockState({
      ratings: { high: false, medium: true, low: false },
    });

    render(
      <RecoilRoot initializeState={mockState}>
        <FilterDrawer onActionSelect={mockHandleAction} />
      </RecoilRoot>
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
    const mockState = createMockState({
      ratings: { high: false, medium: false, low: true },
    });

    render(
      <RecoilRoot initializeState={mockState}>
        <FilterDrawer onActionSelect={mockHandleAction} />
      </RecoilRoot>
    );

    const checkBoxHigh = (await screen.findByLabelText(
      'High'
    )) as HTMLInputElement;
    const checkBoxMedium = screen.getByLabelText('Medium') as HTMLInputElement;
    const checkBoxLow = screen.getByLabelText('Low') as HTMLInputElement;
    expect(checkBoxHigh.checked).toEqual(false);
    expect(checkBoxMedium.checked).toEqual(false);
    expect(checkBoxLow.checked).toEqual(true);
  });

  it('should render Year Range', async () => {
    const mockHandleAction = jest.fn(() => {});
    const mockState = createMockState({
      yearRange: [1770, 1820],
    });

    render(
      <RecoilRoot initializeState={mockState}>
        <FilterDrawer onActionSelect={mockHandleAction} />
      </RecoilRoot>
    );

    const yearRange = await screen.findByTestId('year-range');
    expect(yearRange.textContent).toEqual('1770 - 1820');
  });
});
