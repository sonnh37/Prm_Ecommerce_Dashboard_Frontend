const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "IMAGE", uid: "image"},
  { name: "TITLE", uid: "title", sortable: true },
  { name: "PRICE", uid: "price", sortable: true },
  { name: "CATEGORY", uid: "category", sortable: true },
  { name: "DESCRIPTION", uid: "description" },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Vacation", uid: "vacation" },
];


export { columns, statusOptions };
