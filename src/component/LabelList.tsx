import axiosInstance from "../api/axios";
import labelRequests from "../api/labelRequests";
import Label from "../types/LabelTypes";
import LabelPropsType from "../types/tmpLabelPropsType";

export default function LabelList({
  labels,
  setLabels,
  selectedLabel,
  selectTotalMemo,
  setSelectedLabel,
  setIsSelectTotalMemo,
  isSelectTotalMemo,
  memoList,
}: LabelPropsType) {
  const getLabels = async () => {
    //TODO : Try Catch
    await axiosInstance.get(labelRequests.getLabelList).then(async (res) => {
      const labelsFromServer = await res.data.data;
      setLabels(labelsFromServer);
    });
  };

  const selectLabel = (label: Label | null) => {
    setIsSelectTotalMemo(false);
    setSelectedLabel(label);
    window.history.pushState("", "Memo", `/labelId=${label?.id}`);
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

  const renderLabels = () => {
    if (labels.length === 0) {
      return <div>There are no labels</div>;
    }
    return labels.map((label: Label) => {
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
            </span>
          ) : null}
        </div>
      );
    });
  };

  return (
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
  );
}
