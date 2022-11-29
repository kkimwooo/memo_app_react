import { useEffect, useState } from "react";
import axiosInstance from "./api/axios";
import labelRequests from "./api/labelRequests";
import memoRequests from "./api/memoRequests";

function App() {
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
  const [checkedMemo, setCheckedMemo] = useState<Memo[]>([]);

  // Memo Detail's state
  const [memoTitle, setMemoTitle] = useState<string | null>(null);
  const [memoContent, setMemoContent] = useState<string | null>(null);
  const [isEditMemo, setIsEditMemo] = useState<boolean>(false);

  //Label's
  useEffect(() => {
    console.log("useEffect");
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

  const addLabel = () => {
    const newLabel: Label = {
      title: "라벨 " + (labels.length + 1),
    } as Label;

    //TODO : 중복 검사 필요, try catch
    axiosInstance.post(labelRequests.createLabel, newLabel).then((res) => {
      getLabels();
    });
  };

  const deleteLabel = async (id: string) => {
    //TODO : Try Catch
    await axiosInstance.delete(labelRequests.deleteLabel.replace(":id", id));
    getLabels();
  };

  const selectUpdateTargetLabel = async (id: string) => {
    setEditLabel(id);
  };

  const updateLabel = async (id: string) => {
    //TODO : Try Catch
    await axiosInstance.put(labelRequests.updateLabel.replace(":id", id), {
      title: updateLabelName,
    });
    getLabels();
    setEditLabel(null);
  };

  const selectLabel = (label: Label | null) => {
    setIsSelectTotalMemo(false);
    setSelectedLabel(label);
    window.history.pushState("", "Memo", `/labelId=${label?.id}`);
  };

  //TODO : 기존 selectLabel과 합치기?
  const selectTotalMemo = () => {
    setSelectedLabel(null);
    setIsSelectTotalMemo(!isSelectTotalMemo);
    window.history.pushState("", "Memo", `/`);
  };

  const renderLabels = () => {
    if (labels.length === 0) {
      return <div>There are no labels</div>;
    }
    return labels.map((label) => {
      if (updateTargetLabel === label.id) {
        return (
          <div key={label.id}>
            <input
              type="text"
              maxLength={10}
              defaultValue={label.title}
              onChange={(e) => {
                setUpdateLabelName(e.target.value);
              }}
            />
            <button onClick={() => setEditLabel(null)}>Cancel</button>
            <button
              onClick={() => {
                updateLabel(label.id);
              }}
            >
              Save
            </button>
          </div>
        );
      }
      return (
        <div
          key={label.id}
          onClick={() => {
            if (selectedLabel?.id === label.id) {
              selectLabel(null);
            } else {
              selectLabel(label);
            }
          }}
          style={
            selectedLabel?.id === label.id ? { backgroundColor: "yellow" } : {}
          }
        >
          {`${label.title}(${label.memoCount})`}
          {selectedLabel?.id === label.id ? (
            <span>
              <button onClick={() => deleteLabel(label.id)}>Delete</button>
              <button onClick={() => selectUpdateTargetLabel(label.id)}>
                Rename
              </button>
            </span>
          ) : null}
        </div>
      );
    });
  };

  //Memo's
  useEffect(() => {
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
    setSelectedMemo(memo);
    window.history.pushState("", "Memo", `/memoId=${memo?.id}`);
  };

  const renderMemosByLabel = () => {
    if (memosByLabel.length === 0) {
      return <div>There are no memos</div>;
    }
    return memosByLabel.map((memo) => {
      return (
        <div
          key={memo.id}
          onClick={() => {
            if (selectedMemo?.id === memo.id) {
              selectMemo(null);
            } else {
              selectMemo(memo);
            }
          }}
          style={
            selectedMemo?.id === memo.id ? { backgroundColor: "yellow" } : {}
          }
        >
          {memo.title}
        </div>
      );
    });
  };

  const renderTotalMemos = () => {
    if (memoList.length === 0) {
      return <div>There are no memos</div>;
    }
    return memoList.map((memo) => {
      return (
        <div
          key={memo.id}
          onClick={() => {
            if (selectedMemo?.id === memo.id) {
              selectMemo(null);
            } else {
              selectMemo(memo);
            }
          }}
          style={
            selectedMemo?.id === memo.id ? { backgroundColor: "yellow" } : {}
          }
        >
          {memo.title}
        </div>
      );
    });
  };

  //Memo Detail's
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
    if (isEditMemo) {
      return (
        <div>
          <input
            type="text"
            defaultValue={selectedMemo?.title}
            onChange={(e) => {
              setMemoTitle(e.target.value);
            }}
          />
          <textarea
            defaultValue={selectedMemo?.content}
            onChange={(e) => {
              setMemoContent(e.target.value);
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
      );
    } else {
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
    }
  };

  const renderMemoDetail = () => {
    return (
      <div>
        <div>
          {selectedMemo?.title}{" "}
          <button onClick={() => deleteMemo(selectedMemo!.id)}>삭제</button>{" "}
          <button onClick={() => setIsEditMemo(true)}>수정</button>{" "}
        </div>
        <div>{selectedMemo!.updatedAt.toString()}</div>
        <div>{selectedMemo?.content}</div>
      </div>
    );
  };

  return (
    <div>
      <nav>
        <h1>Note Web</h1>
      </nav>
      <div style={{ display: "flex", height: "100vh" }}>
        <div style={{ flex: "20%", border: "1px solid" }}>
          <div
            onClick={() => selectTotalMemo()}
            style={isSelectTotalMemo ? { backgroundColor: "yellow" } : {}}
          >
            전체 메모({memoList.length})
          </div>
          {renderLabels()}
          <input type="button" value="Add Label" onClick={addLabel} />
        </div>

        <div style={{ width: "30%", border: "1px solid" }}>
          {selectedLabel?.title ? (
            <div>
              <div>
                {selectedLabel.title}
                <button>이름 변경</button>
                <button>설정</button>
                <button>삭제</button>
              </div>
              {renderMemosByLabel()}
            </div>
          ) : (
            <div>
              <div>
                전체 메모 <button>이름 변경</button>
                <button>설정</button>
                <button>삭제</button>
              </div>
              {renderTotalMemos()}
            </div>
          )}
        </div>

        <div style={{ width: "50%", border: "1px solid" }}>
          {selectedMemo ? renderMemoDetail() : renderCreateMemo()}
        </div>
      </div>
    </div>
  );
}

export default App;

interface Memo {
  id: string;
  title: string;
  content: string;
  labels: Label[];
  updatedAt: Date;
  createdAt: Date;
}

interface Label {
  title: string;
  id: string;
  memoCount: number;
  updatedAt: Date;
  createdAt: Date;
}
