import { FilterTag } from '@models/FilterTag.model';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

export const tagsAtom = atom([] as FilterTag[]);

export const useTagsState = () => {
    const state = useAtom(tagsAtom);
    return state;
};

export const useTagsStateGet = () => {
    const value = useAtomValue(tagsAtom);
    return value;
};

export const useTagsStateSet = () => {
    const value = useSetAtom(tagsAtom);
    return value;
};
