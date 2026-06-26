import { Tag } from '@models/Tag.model';
import {
    atom,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from 'recoil';

const tagsAtom = atom({
    key: 'tags',
    default: [] as Tag[],
});

const useTagsState = () => {
    const state = useRecoilState(tagsAtom);
    return state;
};

const useTagsStateGet = () => {
    const value = useRecoilValue(tagsAtom);
    return value;
};

const useTagsStateSet = () => {
    const value = useSetRecoilState(tagsAtom);
    return value;
};

export { tagsAtom, useTagsState, useTagsStateGet, useTagsStateSet };
