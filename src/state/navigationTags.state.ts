import { NavigationTag } from '@models/NavigationTag.model';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

export const navigationTagsAtom = atom([] as NavigationTag[]);

export const useNavigationTagsState = () => {
    const state = useAtom(navigationTagsAtom);
    return state;
};

export const useNavigationTagsStateGet = () => {
    const value = useAtomValue(navigationTagsAtom);
    return value;
};

export const useNavigationTagsStateSet = () => {
    const state = useSetAtom(navigationTagsAtom);
    return state;
};
