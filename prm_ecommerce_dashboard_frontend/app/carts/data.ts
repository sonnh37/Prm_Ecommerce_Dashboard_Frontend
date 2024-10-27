const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "User ID", uid: "userId", sortable: true },
  { name: "Date", uid: "date", sortable: true },
  { name: "Actions", uid: "actions" },
  // { name: "Products", uid: "products" },
//   { name: "Product ID", uid: "productId", sortable: true },
//   { name: "Quantity", uid: "quantity", sortable: true },
];
const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Vacation", uid: "vacation" },
];

export { columns, statusOptions };
