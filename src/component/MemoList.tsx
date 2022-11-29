import Memo from "../types/MemoTypes";
import formattingDate from "../utils/utils";
import axiosInstance from "../api/axios";
import labelRequests from "../api/labelRequests";
import MemoListPropsType from "../types/tmpMemoListPropsType";
export default function MemoList({
  selectedLabel,
  updateTargetLabel,
  updateLabelName,
  memosByLabel,
  memoList,
  selectedMemo,
  setUpdateLabelName,
  setEditLabel,
  setSelectedMemo,
  getLabels,
}: MemoListPropsType) {
  const updateLabel = async (id: string) => {
    //TODO : Try Catch
    await axiosInstance.put(labelRequests.updateLabel.replace(":id", id), {
      title: updateLabelName,
    });
    getLabels();
    setEditLabel(null);
  };

  const selectUpdateTargetLabel = async (id: string) => {
    setEditLabel(id);
  };

  const selectMemo = (memo: Memo | null) => {
    setSelectedMemo(memo);
    window.history.pushState("", "Memo", `/memoId=${memo?.id}`);
  };

  const memoItem = (memo: Memo) => {
    return (
      <div style={{ display: "flex", border: "1px solid" }}>
        <input type="checkbox"></input>
        <div
          key={memo.id}
          onClick={() => {
            selectMemo(memo);
          }}
          style={
            selectedMemo?.id === memo.id ? { backgroundColor: "yellow" } : {}
          }
        >
          <div>{memo.title}</div>
          <div>{formattingDate(memo.updatedAt.toString())}</div>
          <div> {memo.content}</div>
        </div>
      </div>
    );
  };

  const renderMemosByLabel = () => {
    if (memosByLabel.length === 0) {
      return <div>There are no memos</div>;
    }
    return memosByLabel.map((memo: Memo) => {
      return memoItem(memo);
    });
  };

  const renderTotalMemos = () => {
    if (memoList.length === 0) {
      return <div>There are no memos</div>;
    }
    return memoList.map((memo: Memo) => {
      return memoItem(memo);
    });
  };

  return (
    <div style={{ width: "30%", border: "1px solid" }}>
      {selectedLabel?.title ? (
        <div>
          {updateTargetLabel === selectedLabel.id ? (
            <div>
              <input
                type="text"
                defaultValue={selectedLabel.title}
                onChange={(e) => {
                  setUpdateLabelName(e.target.value);
                }}
              />
              <button onClick={() => setEditLabel(null)}>Cancel</button>
              <button
                onClick={() => {
                  updateLabel(selectedLabel.id);
                }}
              >
                Save
              </button>
            </div>
          ) : (
            <div>
              {selectedLabel.title}
              <button onClick={() => selectUpdateTargetLabel(selectedLabel.id)}>
                라벨명 변경
              </button>
              <button>설정</button>
              <button>삭제</button>
            </div>
          )}

          {renderMemosByLabel()}
        </div>
      ) : (
        <div>
          <div>
            전체 메모
            <button>설정</button>
            <button>삭제</button>
          </div>
          {renderTotalMemos()}
        </div>
      )}
    </div>
  );
}
