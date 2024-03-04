import { atom, useRecoilState, useRecoilValue } from 'recoil';

const ratingsAtom = atom({
    key: 'ratings',
    default: {
        high: true,
        medium: true,
        low: false,
    },
});

const useRatingsState = () => {
    const state = useRecoilState(ratingsAtom);
    return state;
};

const useRatingsStateGet = () => {
    const value = useRecoilValue(ratingsAtom);
    return value;
};

const useRatingsStateSet = () => {
    const state = useRecoilState(ratingsAtom);
    return state;
};

export { ratingsAtom, useRatingsState, useRatingsStateGet, useRatingsStateSet };
