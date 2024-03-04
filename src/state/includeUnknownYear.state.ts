import {
    atom,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from 'recoil';

const includeUnknownYearAtom = atom({
    key: 'includeUnknownYear',
    default: true,
});

const useIncludeUnknownYearState = () => {
    const state = useRecoilState(includeUnknownYearAtom);
    return state;
};

const useIncludeUnknownYearStateGet = () => {
    const value = useRecoilValue(includeUnknownYearAtom);
    return value;
};

const useIncludeUnknownYearStateSet = () => {
    const state = useSetRecoilState(includeUnknownYearAtom);
    return state;
};

export {
    includeUnknownYearAtom,
    useIncludeUnknownYearState,
    useIncludeUnknownYearStateGet,
    useIncludeUnknownYearStateSet,
};
