import {
    atom,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from 'recoil';

const sortFieldAtom = atom({
    key: 'sortField',
    default: 'title',
});

const useSortFieldState = () => {
    const state = useRecoilState(sortFieldAtom);
    return state;
};

const useSortFieldStateGet = () => {
    const value = useRecoilValue(sortFieldAtom);
    return value;
};

const useSortFieldStateSet = () => {
    const state = useSetRecoilState(sortFieldAtom);
    return state;
};

export {
    sortFieldAtom,
    useSortFieldState,
    useSortFieldStateGet,
    useSortFieldStateSet,
};
