import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

export enum AllTagsSortOrder {
    Name,
    Count,
}

export const sortFieldAtom = atom({
    sort: 'title',
    allTagsSort: AllTagsSortOrder.Count,
});

export const useSortFieldState = () => {
    const state = useAtom(sortFieldAtom);
    return state;
};

export const useSortFieldStateGet = () => {
    const value = useAtomValue(sortFieldAtom);
    return value;
};

export const useSortFieldStateSet = () => {
    const state = useSetAtom(sortFieldAtom);
    return state;
};
