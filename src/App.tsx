import { useEffect, useState } from "react";
import axiosInstance from "./api/axios";
import labelRequests from "./api/labelRequests";
import memoRequests from "./api/memoRequests";

function App() {
  // Label's state
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  const [updateTargetLabel, setEditLabel] = useState<string | null>(null);
  const [updateLabelName, setUpdateLabelName] = useState<string | null>(null);

  // Memo's state
  const [memoList, setMemoList] = useState<Memo[]>([]);
  const [memosByLabel, setMemosByLabel] = useState<Memo[]>([]);
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);

  //Label's CRUD, render
  useEffect(() => {
    getLabels();
    getMemoList();
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
    setSelectedLabel(label);
    window.history.pushState("", "Memo", `/labelId=${label?.id}`);
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

  //Memo's CRUD, render
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
      });
  };

  const selectMemo = (memo: Memo | null) => {
    setSelectedMemo(memo);
    window.history.pushState("", "Memo", `/memoId=${memo?.id}`);
  };

  const renderMemos = () => {
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

  return (
    <div>
      <nav>
        <h1>Note Web</h1>
      </nav>
      <div style={{ display: "flex", height: "100vh" }}>
        <div style={{ flex: "20%", border: "1px solid" }}>
          <h3>전체 메모({memoList.length})</h3>
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
              {renderMemos()}
            </div>
          ) : (
            <h3>라벨을 선택해주세요</h3>
          )}
        </div>

        <div style={{ width: "50%", border: "1px solid" }}>
          <h3>Memo Detail</h3>
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
  labels: string[];
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
