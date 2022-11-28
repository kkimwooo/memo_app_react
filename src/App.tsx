import { useEffect, useState } from "react";
import axiosInstance from "./api/axios";
import labelRequests from "./api/labelRequests";

function App() {
  const [labels, setLabels] = useState<string[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  useEffect(() => {
    getLabels();
  }, []);

  const getLabels = async () => {
    await axiosInstance.get(labelRequests.getLabelList).then(async (res) => {
      const labelsFromServer = await res.data;
      setLabels(labelsFromServer.data);
    });
  };

  const renderLabels = () => {
    if (labels.length === 0) {
      return <div>There are no labels</div>;
    }
    return labels.map((label) => {
      return (
        <div
          key={label}
          onClick={() => {
            setSelectedLabel(label);
          }}
        >
          {label}
        </div>
      );
    });
  };

  const addLabel = () => {
    const newLabel = "라벨" + (labels.length + 1);
    //TODO : 중복 검사 필요
    setLabels([...labels, newLabel]);
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
