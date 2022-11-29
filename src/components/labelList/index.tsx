import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { labelsState, selectedLabelsState } from "../../recoil/label";
import { memoListState } from "../../recoil/memo";
import axiosInstance from "../../api/axios";
import labelRequests from "../../api/labelRequests";
import Label from "../../types/LabelTypes";

export default function LabelList() {
  const labelsRecoil = useRecoilValue(labelsState);
  const setLabelRecoil = useSetRecoilState(labelsState);

  const selectedLabelsRecoil = useRecoilValue(selectedLabelsState);
  const setSelectedLabelsRecoil = useSetRecoilState(selectedLabelsState);

  const memoListRecoil = useRecoilValue(memoListState);

  const [isSelectTotalMemo, setIsSelectTotalMemo] = useState<boolean>(true);

  const getLabels = async () => {
    //TODO : Try Catch
    await axiosInstance.get(labelRequests.getLabelList).then(async (res) => {
      const labelsFromServer = await res.data.data;
      setLabelRecoil(labelsFromServer);
    });
  };

  const selectLabel = (label: Label | null) => {
    setIsSelectTotalMemo(false);
    setSelectedLabelsRecoil(label);
    //window.history.pushState("", "Memo", `/labelId=${label?.id}`);
  };

  //TODO : 기존 selectLabel과 합치기?
  const selectTotalMemo = () => {
    setSelectedLabelsRecoil(null);
    setIsSelectTotalMemo(!isSelectTotalMemo);
    //window.history.pushState("", "Memo", `/`);
  };

  const addLabel = () => {
    const newLabel: Label = {
      title: "라벨 " + (labelsRecoil.length + 1),
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
    if (labelsRecoil.length === 0) {
      return <div>There are no labels</div>;
    }
    return labelsRecoil.map((label: Label) => {
      return (
        <div
          key={label.id}
          onClick={() => {
            if (selectedLabelsRecoil?.id === label.id) {
              selectLabel(null);
            } else {
              selectLabel(label);
            }
          }}
          style={{
            backgroundColor:
              selectedLabelsRecoil?.id === label.id ? "gray" : "",
            border: "1px solid",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "50px",
          }}
        >
          {`${label.title}(${label.memoCount})`}
          {selectedLabelsRecoil?.id === label.id ? (
            <span>
              <button onClick={() => deleteLabel(label.id)}>Delete</button>
            </span>
          ) : null}
        </div>
      );
    });
  };

  return (
    <div
      style={{
        flex: "20%",
        border: "1px solid",
      }}
    >
      <div
        onClick={() => selectTotalMemo()}
        style={{
          backgroundColor: isSelectTotalMemo ? "gray" : "",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "50px",
        }}
      >
        전체 메모({memoListRecoil.length})
        <input type="button" value="Add Label" onClick={addLabel} />
      </div>
      {renderLabels()}
    </div>
  );
}
