const memoRequests = {
  getMemoList: "/memo",
  createMemo: "/memo",
  getMemo: "/memo/:id",
  updateMemo: "/memo/:id",
  deleteMemo: "/memo/:id",

  getLabelsByMemo: "/memo/:id/labels",
};

export default memoRequests;
