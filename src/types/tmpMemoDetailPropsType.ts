import Label from "./LabelTypes";
import Memo from "./MemoTypes";

export default interface MemoDetailPropsType {
  selectedMemo: Memo | null;
  isEditMemo: boolean;
  setIsEditMemo: React.Dispatch<React.SetStateAction<boolean>>;
  memoTitle: string;
  setMemoTitle: React.Dispatch<React.SetStateAction<string>>;
  memoContent: string | null;
  setMemoContent: React.Dispatch<React.SetStateAction<string | null>>;
  selectedLabel: Label | null;
  selectMemo: (memo: Memo | null) => void;
  getMemoList: () => void;
  getLabels: () => void;
  getMemosByLabel: () => void;
}
