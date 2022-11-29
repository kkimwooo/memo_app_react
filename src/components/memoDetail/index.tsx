import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { labelsState, selectedLabelsState } from "../../recoil/label";
import axiosInstance from "../../api/axios";
import labelRequests from "../../api/labelRequests";
import memoRequests from "../../api/memoRequests";
import Memo from "../../types/MemoTypes";
import MemoDetailPropsType from "../../types/tmpMemoDetailPropsType";
import { formattingDate } from "../../utils/utils";
import { selectedMemoState, isEditMemoState } from "../../recoil/memo";

export default function MemoDetail({
  selectMemo,
  getMemoList,
  getLabels,
  getMemosByLabel,
}: MemoDetailPropsType) {
  const [isCreateNewMemo, setIsCreateNewMemo] = useState(false);
  const [memoTitle, setMemoTitle] = useState<string>("");
  const [memoContent, setMemoContent] = useState<string | null>(null);

  const selectedLabelsRecoil = useRecoilValue(selectedLabelsState);
  const selectedMemoRecoil = useRecoilValue(selectedMemoState);
  const isEditMemoRecoil = useRecoilValue(isEditMemoState);
  const setIsEditMemoRecoil = useSetRecoilState(isEditMemoState);

  const createMemo = async () => {
    const memo: Memo = {
      title: memoTitle,
      content: memoContent,
      labels: [selectedLabelsRecoil],
    } as Memo;
    //TODO : Try Catch , 2개 동시에 비동기로 수행되도록 수정
    const result = await axiosInstance.post(memoRequests.createMemo, memo);

    const resultMemo = result.data.data;
    const memoId = resultMemo.id;

    //선택된 라벨이 전체 메모인 경우엔 라벨을 추가하지 않는다.
    if (selectedLabelsRecoil !== null) {
      await axiosInstance.post(
        labelRequests.addMemosToLabel.replace(":id", selectedLabelsRecoil!.id),
        { memoIds: [memoId] }
      );
    }

    getMemoList();
    getLabels();
    getMemosByLabel();
    selectMemo(resultMemo);
    setIsCreateNewMemo(false);
  };

  const updateMemo = async (id: string) => {
    //TODO : Try Catch
    const response = await axiosInstance.put(
      memoRequests.updateMemo.replace(":id", id),
      {
        title: memoTitle,
        content: memoContent,
        labels: [selectedLabelsRecoil],
      }
    );
    const responseMemo = response.data.data;
    getMemoList();
    getLabels();
    getMemosByLabel();
    selectMemo(responseMemo);
    setIsCreateNewMemo(false);
  };

  //TODO : 바뀔때마다 state 변경할 필요 없음
  const renderCreateMemo = () => {
    return (
      <div>
        <div>
          <input
            type="text"
            placeholder="여기에 제목을 입력하세요"
            onChange={(e) => {
              setMemoTitle(e.target.value);
            }}
          />{" "}
          <button onClick={createMemo}>저장</button>
        </div>
        <div>
          <textarea
            style={{ width: "100%", height: "100vh" }}
            onChange={(e) => setMemoContent(e.target.value)}
            placeholder="여기에 내용을 입력하세요"
          />
        </div>
      </div>
    );
  };

  const renderMemoDetail = () => {
    return (
      <div>
        {isEditMemoRecoil ? (
          <>
            <div>
              <input
                type="text"
                defaultValue={selectedMemoRecoil?.title}
                onChange={(e) => {
                  setMemoTitle(e.target.value);
                }}
              />
              <button
                onClick={() => {
                  setIsEditMemoRecoil(false);
                }}
              >
                취소
              </button>
              <button
                onClick={() => {
                  updateMemo(selectedMemoRecoil!.id);
                }}
              >
                수정
              </button>
            </div>
            <textarea
              defaultValue={selectedMemoRecoil?.content}
              style={{ width: "100%", height: "100vh" }}
              onChange={(e) => {
                setMemoContent(e.target.value);
              }}
            />
          </>
        ) : (
          <>
            <div
              style={{
                border: "1px solid",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {selectedMemoRecoil?.title}

              <button onClick={() => setIsCreateNewMemo(true)}>
                신규 메모 작성
              </button>
            </div>
            <div
              onClick={() => setIsEditMemoRecoil(true)}
              style={{ height: "100vh" }}
            >
              <div style={{ float: "right" }}>
                {formattingDate(selectedMemoRecoil!.updatedAt.toString())}
              </div>
              <textarea
                readOnly={true}
                style={{ width: "100%", height: "100vh" }}
                value={selectedMemoRecoil?.content ?? ""}
              ></textarea>
            </div>
          </>
        )}
      </div>
    );
  };
  return (
    <div style={{ width: "50%", border: "1px solid" }}>
      {isCreateNewMemo
        ? renderCreateMemo()
        : selectedMemoRecoil
        ? renderMemoDetail()
        : renderCreateMemo()}
    </div>
  );
}
