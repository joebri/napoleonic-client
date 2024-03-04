import {
    atom,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from 'recoil';

const yearRangeAtom = atom({
    key: 'yearRange',
    default: [1790, 1815],
});

const useYearRangeState = () => {
    const state = useRecoilState(yearRangeAtom);
    return state;
};

const useYearRangeStateGet = () => {
    const value = useRecoilValue(yearRangeAtom);
    return value;
};

const useYearRangeStateSet = () => {
    const value = useSetRecoilState(yearRangeAtom);
    return value;
};

export {
    yearRangeAtom,
    useYearRangeState,
    useYearRangeStateGet,
    useYearRangeStateSet,
};
