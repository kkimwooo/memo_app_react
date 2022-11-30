import { recoilPersist } from "recoil-persist";

import { atom } from "recoil";
import Label from "../types/LabelTypes";

const { persistAtom } = recoilPersist({ key: "recoil-persist" });

export const labelsState = atom<Label[]>({
  key: `labelsState`,
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const selectedLabelsState = atom<Label | null>({
  key: `selectedLabelsState`,
  default: null,
  effects_UNSTABLE: [persistAtom],
});
