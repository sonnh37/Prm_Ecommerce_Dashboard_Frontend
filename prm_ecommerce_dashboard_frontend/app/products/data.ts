const columns = [
  { name: "ID", uid: "_id", sortable: true },
   { name: "IMAGES", uid: "images" }, // Hiển thị hình ảnh nếu cần
  { name: "NAME", uid: "name", sortable: true },
  { name: "PRICE", uid: "price", sortable: true },
  { name: "BRAND", uid: "brand" }, // Điều chỉnh để lấy tên của thương hiệu
  { name: "CATEGORY", uid: "category"},
  { name: "DESCRIPTION", uid: "description" },
  { name: "QUANTITY SOLD", uid: "quantitySold" },
  { name: "ORIGIN", uid: "origin" },
  { name: "STATUS", uid: "status" },
  { name: "IS DELETE", uid: "isDelete" },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Vacation", uid: "vacation" },
];


export { columns, statusOptions };
