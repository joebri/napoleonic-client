import {
    atom,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from 'recoil';

const headerTitleAtom = atom({
    key: 'headerTitle',
    default: '',
});

const useHeaderTitleState = () => {
    const state = useRecoilState(headerTitleAtom);
    return state;
};

const useHeaderTitleStateGet = () => {
    const value = useRecoilValue(headerTitleAtom);
    return value;
};

const useHeaderTitleStateSet = () => {
    const value = useSetRecoilState(headerTitleAtom);
    return value;
};

export {
    headerTitleAtom,
    useHeaderTitleState,
    useHeaderTitleStateGet,
    useHeaderTitleStateSet,
};
