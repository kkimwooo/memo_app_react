import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import Memo from "../types/MemoTypes";

const { persistAtom } = recoilPersist({ key: "recoil-persist" });

export const memoListState = atom<Memo[]>({
  key: `memoListState`,
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const selectedMemoState = atom<Memo | null>({
  key: `selectedMemoState`,
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const isEditMemoState = atom<boolean>({
  key: `isEditMemoState`,
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const checkedMemoIdsState = atom<string[]>({
  key: `checkedMemoIdsState`,
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const memosByLabelState = atom<Memo[]>({
  key: `memosByLabelState`,
  default: [],
  effects_UNSTABLE: [persistAtom],
});
