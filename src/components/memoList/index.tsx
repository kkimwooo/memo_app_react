import Memo from "../../types/MemoTypes";
import formattingDate from "../../utils/utils";
import axiosInstance from "../../api/axios";
import labelRequests from "../../api/labelRequests";
import MemoListPropsType from "../../types/tmpMemoListPropsType";
import memoRequests from "../../api/memoRequests";
export default function MemoList({
  selectedLabel,
  updateTargetLabel,
  updateLabelName,
  memosByLabel,
  memoList,
  selectedMemo,
  checkedMemoIds,
  setUpdateLabelName,
  setEditLabel,
  selectMemo,
  getLabels,
  setCheckedMemoIds,
  getMemoList,
  getMemosByLabel,
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

  const onCheckMemo = (checkedId: string, checked: boolean) => {
    if (checked) {
      setCheckedMemoIds([...checkedMemoIds, checkedId]);
    } else {
      setCheckedMemoIds(
        checkedMemoIds.filter((memoId) => memoId !== checkedId)
      );
    }
  };

  const deleteMemos = async () => {
    //TODO : Try Catch
    checkedMemoIds.forEach(async (memoId) => {
      await axiosInstance.delete(
        memoRequests.deleteMemo.replace(":id", memoId)
      );
    });
    getMemoList();
    getLabels();
    getMemosByLabel();
    selectMemo(null);
    setCheckedMemoIds([]);
  };

  const memoItem = (memo: Memo) => {
    return (
      <div
        key={memo.id}
        style={{
          display: "flex",
          border: "1px solid",
          alignItems: "center",
          height: "60px",
        }}
      >
        <input
          type="checkbox"
          style={{ width: "10%" }}
          id={memo.id}
          onChange={(e) => onCheckMemo(e.target.id, e.target.checked)}
        ></input>
        <div
          onClick={() => {
            selectMemo(memo);
          }}
          style={{
            backgroundColor: selectedMemo?.id === memo.id ? "gray" : "",
          }}
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
      return (
        <div style={{ display: "flex", height: "100vh", alignItems: "center" }}>
          <h2>
            해당 라벨에 메모가 없습니다. 라벨을 선택 후 우측 메모장에서 메모를
            작성해주세요
          </h2>
        </div>
      );
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

  //TODO : 컴포넌트 분리 필요
  return (
    <div style={{ width: "30%", border: "1px solid" }}>
      {selectedLabel?.title ? (
        <div style={{ width: "100%" }}>
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
            <div
              style={{
                border: "1px solid",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {selectedLabel.title}
              <div>
                <button
                  onClick={() => selectUpdateTargetLabel(selectedLabel.id)}
                >
                  라벨명 변경
                </button>
                {checkedMemoIds.length > 0 ? (
                  <>
                    <button>라벨 지정</button>
                    <button>라벨 제거</button>
                    <button onClick={() => deleteMemos()}>삭제</button>
                  </>
                ) : null}
              </div>
            </div>
          )}
          {renderMemosByLabel()}
        </div>
      ) : (
        <div>
          <div
            style={{
              border: "1px solid",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            전체 메모
            <div>
              {checkedMemoIds.length > 0 ? (
                <>
                  <button>라벨 지정</button>
                  <button>라벨 제거</button>
                  <button onClick={() => deleteMemos()}>삭제</button>
                </>
              ) : null}
            </div>
          </div>
          {renderTotalMemos()}
        </div>
      )}
    </div>
  );
}
