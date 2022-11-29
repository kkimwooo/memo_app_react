import Memo from "./MemoTypes";

export default interface MemoListPropsType {
  selectMemo: (memo: Memo | null) => void;
  getLabels: () => void;
  getMemoList: () => void;
  getMemosByLabel: () => void;
}
