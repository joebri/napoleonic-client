import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

export const yearRangeAtom = atom([1700, 1900]);

export const useYearRangeState = () => {
    const state = useAtom(yearRangeAtom);
    return state;
};

export const useYearRangeStateGet = () => {
    const value = useAtomValue(yearRangeAtom);
    return value;
};

export const useYearRangeStateSet = () => {
    const value = useSetAtom(yearRangeAtom);
    return value;
};
