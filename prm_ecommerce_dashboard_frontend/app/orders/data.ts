const columns = [
  { name: "ID", uid: "_id", sortable: true },
  //  { name: "IMAGES", uid: "images" }, // Hiển thị hình ảnh nếu cần
  { name: "TOTAL PRICE", uid: "totalPrice", sortable: true },
  { name: "USER", uid: "user" }, // Điều chỉnh để lấy tên của thương hiệu
  { name: "CART", uid: "cart"},
  { name: "VOUCHER", uid: "voucher"},
  { name: "PRICE BEFORE SHIP", uid: "priceBeforeShip" },
  { name: "DATE", uid: "date" },
  { name: "STATUS", uid: "status" },
  { name: "IS DELETED", uid: "isDeleted" },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Vacation", uid: "vacation" },
];


export { columns, statusOptions };
