// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom

import '@testing-library/jest-dom';
import dotenv from 'dotenv';
import matchers from 'jest-extended/all';
import { enableFetchMocks } from 'jest-fetch-mock';

import { AppContextType } from 'AppContext';
import { NavigationTag, Tag } from 'types';

enableFetchMocks();

expect.extend(matchers);

dotenv.config({ path: '.env' });

// afterEach(() => {
//   jest.useRealTimers();
// });

jest.mock('react-helmet-async', () => {
  const React = require('react');
  const plugin = jest.requireActual('react-helmet-async');
  const mockHelmet = ({ children, ...props }: any) =>
    React.createElement(
      'div',
      {
        ...props,
        className: 'mock-helmet',
      },
      children
    );
  return {
    ...plugin,
    Helmet: jest.fn().mockImplementation(mockHelmet),
  };
});

const mockAppContext: AppContextType = {
  headerTitle: '',
  includeUnknownYear: false,
  isFilterOpen: true,
  navigationTags: [] as NavigationTag[],
  pageNumber: 1,
  ratings: { high: false, medium: false, low: false },
  setHeaderTitle: (() => {}) as Function,
  setIncludeUnknownYear: (() => {}) as Function,
  setIsFilterOpen: (() => {}) as Function,
  setNavigationTags: (() => {}) as Function,
  setPageNumber: (() => {}) as Function,
  setRatings: (() => {}) as Function,
  setSortField: (() => {}) as Function,
  setTags: (() => {}) as Function,
  setYearRange: (() => {}) as Function,
  sortField: '',
  tags: [
    {
      group: 'Nation',
      isSelected: false,
      name: 'France',
    },
  ] as Tag[],
  yearRange: [] as number[],
};
export { mockAppContext };
