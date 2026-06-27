import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

export const isFilterOpenAtom = atom(false);

export const useIsFilterOpenState = () => {
    const state = useAtom(isFilterOpenAtom);
    return state;
};

export const useIsFilterOpenStateGet = () => {
    const value = useAtomValue(isFilterOpenAtom);
    return value;
};

export const useIsFilterOpenStateSet = () => {
    const state = useSetAtom(isFilterOpenAtom);
    return state;
};
