import Label from "./LabelTypes";
import Memo from "./MemoTypes";

export default interface MemoListPropsType {
  selectedLabel: Label | null;
  updateTargetLabel: string | null;
  updateLabelName: string | null;
  memosByLabel: Memo[];
  memoList: Memo[];
  selectedMemo: Memo | null;
  checkedMemoIds: string[];
  setUpdateLabelName: React.Dispatch<React.SetStateAction<string | null>>;
  setEditLabel: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedMemo: React.Dispatch<React.SetStateAction<Memo | null>>;
  selectMemo: (memo: Memo | null) => void;
  getLabels: () => void;
  setCheckedMemoIds: React.Dispatch<React.SetStateAction<string[]>>;
}
