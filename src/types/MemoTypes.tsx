import Label from "./LabelTypes";

export default interface Memo {
  id: string;
  title: string;
  content: string;
  labels: Label[];
  updatedAt: Date;
  createdAt: Date;
}
