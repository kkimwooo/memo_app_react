import axiosInstance from "../api/axios";
import labelRequests from "../api/labelRequests";
import memoRequests from "../api/memoRequests";
import Memo from "../types/MemoTypes";
import MemoDetailPropsType from "../types/tmpMemoDetailPropsType";
import formattingDate from "../utils/utils";

export default function MemoDetail({
  selectedMemo,
  isEditMemo,
  setIsEditMemo,
  memoTitle,
  setMemoTitle,
  memoContent,
  setMemoContent,
  selectedLabel,
  selectMemo,
  getMemoList,
  getLabels,
  getMemosByLabel,
}: MemoDetailPropsType) {
  const createMemo = async () => {
    const memo: Memo = {
      title: memoTitle,
      content: memoContent,
      labels: [selectedLabel],
    } as Memo;
    //TODO : Try Catch , 2개 동시에 비동기로 수행되도록 수정
    const result = await axiosInstance.post(memoRequests.createMemo, memo);

    const resultMemo = result.data.data;
    const memoId = resultMemo.id;

    //선택된 라벨이 전체 메모인 경우엔 라벨을 추가하지 않는다.
    if (selectedLabel !== null) {
      await axiosInstance.post(
        labelRequests.addMemosToLabel.replace(":id", selectedLabel!.id),
        { memoIds: [memoId] }
      );
    }

    getMemoList();
    getLabels();
    getMemosByLabel();
    selectMemo(resultMemo);
  };

  const deleteMemo = async (id: string) => {
    //TODO : Try Catch
    await axiosInstance.delete(memoRequests.deleteMemo.replace(":id", id));
    getMemoList();
    getLabels();
    getMemosByLabel();
    selectMemo(null);
  };

  const updateMemo = async (id: string) => {
    //TODO : Try Catch
    await axiosInstance.put(memoRequests.updateMemo.replace(":id", id), {
      title: memoTitle,
      content: memoContent,
    });
    getMemoList();
    getLabels();
    getMemosByLabel();
    selectMemo(selectedMemo);
  };

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
          <button onClick={createMemo}>Create</button>
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
        {isEditMemo ? (
          <>
            <div>
              <input
                type="text"
                defaultValue={selectedMemo?.title}
                onChange={(e) => {
                  setMemoTitle(e.target.value);
                }}
              />
              <button
                onClick={() => {
                  setIsEditMemo(false);
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateMemo(selectedMemo!.id);
                }}
              >
                Save
              </button>
            </div>
            <textarea
              defaultValue={selectedMemo?.content}
              style={{ width: "100%", height: "100vh" }}
              onChange={(e) => {
                setMemoContent(e.target.value);
              }}
            />
          </>
        ) : (
          <>
            <div style={{ border: "1px solid" }}>
              {selectedMemo?.title}{" "}
              <button onClick={() => deleteMemo(selectedMemo!.id)}>삭제</button>{" "}
            </div>
            <div
              onClick={() => setIsEditMemo(true)}
              style={{ height: "100vh" }}
            >
              <div>{formattingDate(selectedMemo!.updatedAt.toString())}</div>
              <div>{selectedMemo?.content}</div>
            </div>
          </>
        )}
      </div>
    );
  };
  return (
    <div style={{ width: "50%", border: "1px solid" }}>
      {selectedMemo ? renderMemoDetail() : renderCreateMemo()}
    </div>
  );
}
