import { atom } from "recoil";
import Memo from "../types/MemoTypes";

export const memoListState = atom<Memo[]>({
  key: `memoListState`,
  default: [],
});

export const selectedMemoState = atom<Memo | null>({
  key: `selectedMemoState`,
  default: null,
});

export const isEditMemoState = atom<boolean>({
  key: `isEditMemoState`,
  default: false,
});

export const checkedMemoIdsState = atom<string[]>({
  key: `checkedMemoIdsState`,
  default: [],
});

export const memosByLabelState = atom<Memo[]>({
  key: `memosByLabelState`,
  default: [],
});
