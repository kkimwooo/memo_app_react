import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import labelRequests from "../api/labelRequests";
import memoRequests from "../api/memoRequests";
import LabelList from "../components/labelList";
import Memo from "../types/MemoTypes";
import Label from "../types/LabelTypes";
import MemoList from "../components/memoList";
import MemoDetail from "../components/memoDetail";

export default function Home() {
  // Label's state
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  const [isSelectTotalMemo, setIsSelectTotalMemo] = useState<boolean>(true);
  const [updateTargetLabel, setEditLabel] = useState<string | null>(null);
  const [updateLabelName, setUpdateLabelName] = useState<string | null>(null);

  // Memo's state
  const [memoList, setMemoList] = useState<Memo[]>([]);
  const [memosByLabel, setMemosByLabel] = useState<Memo[]>([]);
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);
  const [checkedMemoIds, setCheckedMemoIds] = useState<string[]>([]);

  // Memo Detail's state
  const [memoTitle, setMemoTitle] = useState<string>("");
  const [memoContent, setMemoContent] = useState<string | null>(null);
  const [isEditMemo, setIsEditMemo] = useState<boolean>(false);

  //Label's
  useEffect(() => {
    getLabels();
    getMemoList();
    //TODO : url parameter 가져와서 memo, label 선택하기
  }, []);

  const getLabels = async () => {
    //TODO : Try Catch
    await axiosInstance.get(labelRequests.getLabelList).then(async (res) => {
      const labelsFromServer = await res.data.data;
      setLabels(labelsFromServer);
    });
  };

  useEffect(() => {
    setIsEditMemo(false);
    setCheckedMemoIds([]);
    getMemosByLabel();
  }, [selectedLabel]);

  const getMemoList = async () => {
    //TODO : Try Catch
    await axiosInstance.get(memoRequests.getMemoList).then(async (res) => {
      const memosFromServer = await res.data.data;
      setMemoList(memosFromServer);
    });
  };

  const getMemosByLabel = async () => {
    if (selectedLabel === null) {
      setMemosByLabel([]);
      return;
    }
    //TODO : Try Catch
    await axiosInstance
      .get(labelRequests.getMemosByLabel.replace(":id", selectedLabel.id))
      .then(async (res) => {
        const memosFromServer = await res.data.data;
        setMemosByLabel(memosFromServer);
        selectMemo(memosFromServer[0]);
      });
  };

  const selectMemo = (memo: Memo | null) => {
    setIsEditMemo(false);
    setSelectedMemo(memo);
    //window.history.pushState("", "Memo", `/memoId=${memo?.id}`);
  };

  return (
    <div>
      <nav>
        <h1>Note Web</h1>
      </nav>
      <div style={{ display: "flex", height: "100vh" }}>
        <LabelList
          labels={labels}
          setLabels={setLabels}
          selectedLabel={selectedLabel}
          setSelectedLabel={setSelectedLabel}
          setIsSelectTotalMemo={setIsSelectTotalMemo}
          isSelectTotalMemo={isSelectTotalMemo}
          memoList={memoList}
        />
        <MemoList
          selectedLabel={selectedLabel}
          updateTargetLabel={updateTargetLabel}
          updateLabelName={updateLabelName}
          memosByLabel={memosByLabel}
          memoList={memoList}
          selectedMemo={selectedMemo}
          checkedMemoIds={checkedMemoIds}
          labels={labels}
          setUpdateLabelName={setUpdateLabelName}
          setEditLabel={setEditLabel}
          setSelectedMemo={setSelectedMemo}
          selectMemo={selectMemo}
          getLabels={getLabels}
          setCheckedMemoIds={setCheckedMemoIds}
          getMemoList={getMemoList}
          getMemosByLabel={getMemosByLabel}
        />

        <MemoDetail
          selectedMemo={selectedMemo}
          isEditMemo={isEditMemo}
          setIsEditMemo={setIsEditMemo}
          memoTitle={memoTitle}
          setMemoTitle={setMemoTitle}
          memoContent={memoContent}
          setMemoContent={setMemoContent}
          selectedLabel={selectedLabel}
          selectMemo={selectMemo}
          getMemoList={getMemoList}
          getLabels={getLabels}
          getMemosByLabel={getMemosByLabel}
        />
      </div>
    </div>
  );
}
