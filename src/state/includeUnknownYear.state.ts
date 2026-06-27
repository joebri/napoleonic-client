import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

export const includeUnknownYearAtom = atom(true);

export const useIncludeUnknownYearState = () => {
    const state = useAtom(includeUnknownYearAtom);
    return state;
};

export const useIncludeUnknownYearStateGet = () => {
    const value = useAtomValue(includeUnknownYearAtom);
    return value;
};

export const useIncludeUnknownYearStateSet = () => {
    const state = useSetAtom(includeUnknownYearAtom);
    return state;
};
