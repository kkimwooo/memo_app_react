import { atom } from "recoil";
import Label from "../types/LabelTypes";

export const labelsState = atom<Label[]>({
  key: `labelsState`,
  default: [],
});

export const selectedLabelsState = atom<Label | null>({
  key: `selectedLabelsState`,
  default: null,
});
