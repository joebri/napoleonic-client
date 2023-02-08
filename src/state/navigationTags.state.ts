import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { NavigationTag } from 'types';

const navigationTagsAtom = atom({
  key: 'navigationTags',
  default: [] as NavigationTag[],
});

const useNavigationTagsState = () => {
  const state = useRecoilState(navigationTagsAtom);
  return state;
};

const useNavigationTagsStateGet = () => {
  const value = useRecoilValue(navigationTagsAtom);
  return value;
};

const useNavigationTagsStateSet = () => {
  const state = useSetRecoilState(navigationTagsAtom);
  return state;
};

export {
  navigationTagsAtom,
  useNavigationTagsState,
  useNavigationTagsStateGet,
  useNavigationTagsStateSet,
};
