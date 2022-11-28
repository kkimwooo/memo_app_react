const memoRequests = {
  getMemoList: "/memos",
  createMemo: "/memos",
  getMemo: "/memos/:id",
  updateMemo: "/memos/:id",
  deleteMemo: "/memos/:id",

  getLabelsByMemo: "/memos/:id/labels",
};

export default memoRequests;
