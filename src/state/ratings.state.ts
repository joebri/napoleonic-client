import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

export const ratingsAtom = atom({
    high: true,
    medium: true,
    low: false,
});

export const useRatingsState = () => {
    const state = useAtom(ratingsAtom);
    return state;
};

export const useRatingsStateGet = () => {
    const value = useAtomValue(ratingsAtom);
    return value;
};

export const useRatingsStateSet = () => {
    const state = useSetAtom(ratingsAtom);
    return state;
};
