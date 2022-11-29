import Label from "./LabelTypes";
import Memo from "./MemoTypes";

export default interface LabelPropsType {
  selectedLabel: Label | null;
  setSelectedLabel: React.Dispatch<React.SetStateAction<Label | null>>;
  setIsSelectTotalMemo: React.Dispatch<React.SetStateAction<boolean>>;
  isSelectTotalMemo: boolean;
  memoList: Memo[];
}
