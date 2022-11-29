import { atom } from "recoil";
import Memo from "../types/MemoTypes";

export const memoListState = atom<Memo[]>({
  key: `memoListState`,
  default: [],
});
