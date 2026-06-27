import { Tag } from '@models/Tag.model';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

export const tagsAtom = atom([] as Tag[]);

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
