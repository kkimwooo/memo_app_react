import { atom } from "recoil";
import Label from "../types/LabelTypes";

export const labelsState = atom<Label[]>({
  key: `labelsState`,
  default: [],
});
