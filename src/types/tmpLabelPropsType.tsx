import Label from "./LabelTypes";
import Memo from "./MemoTypes";

export default interface LabelPropsType {
  labels: Label[];
  setLabels: React.Dispatch<React.SetStateAction<Label[]>>;
  selectedLabel: Label | null;
  selectTotalMemo: () => void;
  setSelectedLabel: React.Dispatch<React.SetStateAction<Label | null>>;
  setIsSelectTotalMemo: React.Dispatch<React.SetStateAction<boolean>>;
  isSelectTotalMemo: boolean;
  memoList: Memo[];
}
