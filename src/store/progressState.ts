import { atom } from 'recoil';

export const progressState = atom<number>({
  key: 'progressState',
  default: 0,
});