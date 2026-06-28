import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

export enum ItemTagsSortOrder {
    Title = 'title',
    Image = 'image',
}

export enum TagsSortOrder {
    Name,
    Count,
}

export const sortFieldAtom = atom({
    itemTagsSort: ItemTagsSortOrder.Title,
    allTagsSort: TagsSortOrder.Count,
    artistTagsSort: TagsSortOrder.Count,
    battleTagsSort: TagsSortOrder.Count,
    regimentTagsSort: TagsSortOrder.Count,
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
