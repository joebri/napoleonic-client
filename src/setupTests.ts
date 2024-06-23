// import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import dotenv from 'dotenv';
import { MutableSnapshot } from 'recoil';
import { afterEach, vi } from 'vitest';

import {
    includeUnknownYearAtom,
    isFilterOpenAtom,
    ratingsAtom,
    tagsAtom,
    yearRangeAtom,
} from 'state';
import { Tag } from 'types';

// import { enableFetchMocks } from 'jest-fetch-mock';
// enableFetchMocks();

// import createFetchMock from 'vitest-fetch-mock';
// export const fetchMocker = createFetchMock(vi);
// fetchMocker.enableMocks();

dotenv.config({ path: '.env' });

afterEach(() => {
    cleanup();
    vi.useRealTimers();
});

// vi.mock('react-helmet-async', async () => {
//     const React = require('react');
//     const plugin = await vi.importActual('react-helmet-async');
//     const mockHelmet = ({ children, ...props }: any) =>
//         React.createElement(
//             'div',
//             {
//                 ...props,
//                 className: 'mock-helmet',
//             },
//             children
//         );
//     return {
//         ...plugin,
//         Helmet: vi.fn().mockImplementation(mockHelmet),
//     };
// });

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
