import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

export const headerTitleAtom = atom('');

export const useHeaderTitleState = () => {
    const state = useAtom(headerTitleAtom);
    return state;
};

export const useHeaderTitleStateGet = () => {
    const value = useAtomValue(headerTitleAtom);
    return value;
};

export const useHeaderTitleStateSet = () => {
    const value = useSetAtom(headerTitleAtom);
    return value;
};
