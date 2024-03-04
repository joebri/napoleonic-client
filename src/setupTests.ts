// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import dotenv from 'dotenv';
import matchers from 'jest-extended/all';
import { enableFetchMocks } from 'jest-fetch-mock';
import { MutableSnapshot } from 'recoil';

import {
    includeUnknownYearAtom,
    isFilterOpenAtom,
    ratingsAtom,
    tagsAtom,
    yearRangeAtom,
} from 'state';
import { Tag } from 'types';

enableFetchMocks();

expect.extend(matchers);

dotenv.config({ path: '.env' });

afterEach(() => {
    jest.useRealTimers();
});

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

type MockState = {
    includeUnknownYear?: boolean;
    ratings?: any;
    tags?: Tag[];
    yearRange?: number[];
};

function createMockState({
    includeUnknownYear = false,
    ratings = { high: false, medium: false, low: false },
    tags = [
        {
            group: 'Nation',
            isSelected: false,
            name: 'France',
        },
    ] as Tag[],
    yearRange = [] as number[],
}: MockState) {
    const mockState = ({ set }: MutableSnapshot) => {
        set(isFilterOpenAtom, true);
        set(includeUnknownYearAtom, includeUnknownYear);
        set(ratingsAtom, ratings);
        set(tagsAtom, tags);
        set(yearRangeAtom, yearRange);
    };
    return mockState;
}

export { createMockState };
