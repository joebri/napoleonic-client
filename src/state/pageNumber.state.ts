import {
    atom,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from 'recoil';

const pageNumberAtom = atom({
    key: 'pageNumber',
    default: 1,
});

const usePageNumberState = () => {
    const state = useRecoilState(pageNumberAtom);
    return state;
};

const usePageNumberStateGet = () => {
    const value = useRecoilValue(pageNumberAtom);
    return value;
};

const usePageNumberStateSet = () => {
    const state = useSetRecoilState(pageNumberAtom);
    return state;
};

export {
    pageNumberAtom,
    usePageNumberState,
    usePageNumberStateGet,
    usePageNumberStateSet,
};
