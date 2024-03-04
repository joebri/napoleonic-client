import {
    atom,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from 'recoil';

const isFilterOpenAtom = atom({
    key: 'isFilterOpen',
    default: false,
});

const useIsFilterOpenState = () => {
    const state = useRecoilState(isFilterOpenAtom);
    return state;
};

const useIsFilterOpenStateGet = () => {
    const value = useRecoilValue(isFilterOpenAtom);
    return value;
};

const useIsFilterOpenStateSet = () => {
    const state = useSetRecoilState(isFilterOpenAtom);
    return state;
};

export {
    isFilterOpenAtom,
    useIsFilterOpenState,
    useIsFilterOpenStateGet,
    useIsFilterOpenStateSet,
};
