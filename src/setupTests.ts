// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom

import '@testing-library/jest-dom';
import matchers from 'jest-extended/all';
import dotenv from 'dotenv';
import { enableFetchMocks } from 'jest-fetch-mock';

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
