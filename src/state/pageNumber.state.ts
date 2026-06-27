import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

export const pageNumberAtom = atom(1);

export const usePageNumberState = () => {
    const state = useAtom(pageNumberAtom);
    return state;
};

export const usePageNumberStateGet = () => {
    const value = useAtomValue(pageNumberAtom);
    return value;
};

export const usePageNumberStateSet = () => {
    const state = useSetAtom(pageNumberAtom);
    return state;
};
