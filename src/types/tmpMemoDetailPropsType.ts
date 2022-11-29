import Memo from "./MemoTypes";

export default interface MemoDetailPropsType {
  selectMemo: (memo: Memo | null) => void;
  getMemoList: () => void;
  getLabels: () => void;
  getMemosByLabel: () => void;
}
