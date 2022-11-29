import { useEffect, useState } from "react";
import axiosInstance from "./api/axios";
import labelRequests from "./api/labelRequests";
import memoRequests from "./api/memoRequests";
import LabelList from "./component/LabelList";
import Memo from "./types/MemoTypes";
import Label from "./types/LabelTypes";
import MemoList from "./component/MemoList";

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

  //util
  const formattingDate = (date: string) => {
    const newDate = new Date(date);
    return `${newDate.getFullYear()}.${
      newDate.getMonth() + 1
    }.${newDate.getDate()} ${newDate.getHours()}:${newDate.getMinutes()}`;
  };

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

  //TODO : 기존 selectLabel과 합치기?
  const selectTotalMemo = () => {
    setSelectedLabel(null);
    setIsSelectTotalMemo(!isSelectTotalMemo);
    window.history.pushState("", "Memo", `/`);
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
        <div>{formattingDate(selectedMemo!.updatedAt.toString())}</div>
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
        <LabelList
          labels={labels}
          setLabels={setLabels}
          selectedLabel={selectedLabel}
          selectTotalMemo={selectTotalMemo}
          setSelectedLabel={setSelectedLabel}
          setIsSelectTotalMemo={setIsSelectTotalMemo}
          isSelectTotalMemo={isSelectTotalMemo}
          memoList={memoList}
        />
        <MemoList
          selectedLabel={selectedLabel}
          updateTargetLabel={updateTargetLabel}
          updateLabelName={updateLabelName}
          memosByLabel={memosByLabel}
          memoList={memoList}
          selectedMemo={selectedMemo}
          setUpdateLabelName={setUpdateLabelName}
          setEditLabel={setEditLabel}
          setSelectedMemo={setSelectedMemo}
          getLabels={getLabels}
        />

        <div style={{ width: "50%", border: "1px solid" }}>
          {selectedMemo ? renderMemoDetail() : renderCreateMemo()}
        </div>
      </div>
    </div>
  );
}

export default App;
