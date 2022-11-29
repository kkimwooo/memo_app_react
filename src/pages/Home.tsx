import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import axiosInstance from "../api/axios";
import labelRequests from "../api/labelRequests";
import memoRequests from "../api/memoRequests";
import LabelList from "../components/labelList";
import Memo from "../types/MemoTypes";
import MemoList from "../components/memoList";
import MemoDetail from "../components/memoDetail";
import { labelsState, selectedLabelsState } from "../recoil/label";
import {
  memoListState,
  selectedMemoState,
  isEditMemoState,
  checkedMemoIdsState,
  memosByLabelState,
} from "../recoil/memo";

export default function Home() {
  const setLabelRecoil = useSetRecoilState(labelsState);
  const selectedLabelsRecoil = useRecoilValue(selectedLabelsState);
  const setMemoListRecoil = useSetRecoilState(memoListState);
  const setSelectedMemoStateRecoil = useSetRecoilState(selectedMemoState);
  const setCheckedMemoIdsRecoil = useSetRecoilState(checkedMemoIdsState);
  const setIsEditMemoRecoil = useSetRecoilState(isEditMemoState);
  const setMemosByLabelRecoil = useSetRecoilState(memosByLabelState);

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
      setLabelRecoil(labelsFromServer);
    });
  };

  useEffect(() => {
    setIsEditMemoRecoil(false);
    setCheckedMemoIdsRecoil([]);
    getMemosByLabel();
  }, [selectedLabelsRecoil]);

  const getMemoList = async () => {
    //TODO : Try Catch
    await axiosInstance.get(memoRequests.getMemoList).then(async (res) => {
      const memosFromServer = await res.data.data;
      setMemoListRecoil(memosFromServer);
    });
  };

  const getMemosByLabel = async () => {
    if (selectedLabelsRecoil === null) {
      setMemosByLabelRecoil([]);
      return;
    }
    //TODO : Try Catch
    await axiosInstance
      .get(
        labelRequests.getMemosByLabel.replace(":id", selectedLabelsRecoil.id)
      )
      .then(async (res) => {
        const memosFromServer = await res.data.data;
        setMemosByLabelRecoil(memosFromServer);
        selectMemo(memosFromServer[0]);
      });
  };

  const selectMemo = (memo: Memo | null) => {
    setIsEditMemoRecoil(false);
    setSelectedMemoStateRecoil(memo);
    //window.history.pushState("", "Memo", `/memoId=${memo?.id}`);
  };

  return (
    <div>
      <nav>
        <h1>Note Web</h1>
      </nav>
      <div style={{ display: "flex", height: "100vh" }}>
        <LabelList />
        <MemoList
          selectMemo={selectMemo}
          getLabels={getLabels}
          getMemoList={getMemoList}
          getMemosByLabel={getMemosByLabel}
        />

        <MemoDetail
          selectMemo={selectMemo}
          getMemoList={getMemoList}
          getLabels={getLabels}
          getMemosByLabel={getMemosByLabel}
        />
      </div>
    </div>
  );
}
