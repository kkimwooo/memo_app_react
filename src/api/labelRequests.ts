const labelRequests = {
  getLabelList: "/labels",
  createLabel: "/labels",
  getLabel: "/labels/:id",
  updateLabel: "/labels/:id",
  deleteLabel: "/labels/:id",

  getMemosByLabel: "/labels/:id/memos",
  addMemosToLabel: "/labels/:id/memos",
  deleteMemoFromLabel: "/labels/:id/memos/delete",
};

export default labelRequests;
