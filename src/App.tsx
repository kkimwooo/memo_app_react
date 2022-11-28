import { useEffect, useState } from "react";
import axiosInstance from "./api/axios";
import labelRequests from "./api/labelRequests";

function App() {
  // Label's state
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [updateTargetLabel, setEditLabel] = useState<string | null>(null);
  const [updateLabelName, setUpdateLabelName] = useState<string | null>(null);

  //Label's CRUD, render
  useEffect(() => {
    getLabels();
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

  const selectLabel = (id: string | null) => {
    setSelectedLabel(id);
    window.history.pushState("", "Memo", `/labelId=${id}`);
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
            if (selectedLabel === label.id) {
              selectLabel(null);
            } else {
              selectLabel(label.id);
            }
          }}
          style={
            selectedLabel === label.id ? { backgroundColor: "yellow" } : {}
          }
        >
          {label.title}
          {selectedLabel === label.id ? (
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

  return (
    <div>
      <nav>
        <h1>Note Web</h1>
      </nav>
      <div style={{ display: "flex", height: "100vh" }}>
        <div style={{ flex: "20%", border: "1px solid" }}>
          <h3>Labels({"MemoList.length"})</h3>
          {renderLabels()}
          <input type="button" value="Add Label" onClick={addLabel} />
        </div>
        <div style={{ width: "30%", border: "1px solid" }}>
          <h3>Memo List</h3>
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
