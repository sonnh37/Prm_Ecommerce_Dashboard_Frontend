"use client";

import {
  ChevronDownIcon,
  PlusIcon,
  SearchIcon,
  VerticalDotsIcon,
} from "@/components/icons";
import { capitalize } from "@/libs/utils";
import orderService from "@/services/order-service";
import { Order } from "@/types/order";
import {
  Button,
  ChipProps,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { columns, statusOptions } from "./data";
import Image from "next/image";
import { AddOrUpdateOrder } from "./add-or-update-order";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  // "products",
  "user",
  "cart",
  "voucher",
  "priceBeforeShip",
  "totalPrice",
  "date",
  "status",
  "isDeleted",
  "actions",
];
export default function App() {
  const [orders, setOrders] = useState<Order[]>([]); // Khởi tạo state cho orders

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onOpenChange: onOpenChangeDelete,
  } = useDisclosure();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const pages = Math.ceil(orders.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  // useEffect để fetch dữ liệu khi component mount
  useEffect(() => {
    if (orders.length == 0) {
      const fetchData = async () => {
        try {
          const data = await orderService.fetchAll();
          setOrders(data);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        }
      };

      fetchData();
    }
  }, []);

  const handleDeleteOrder = async () => {
    try {
      if (selectedOrder) {
        await orderService.delete(selectedOrder._id!);
        onOpenChangeDelete(); // Đóng modal sau khi xóa thành công
        // Cập nhật lại danh sách sản phẩm nếu cần
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== selectedOrder._id)
        );
      }
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  const filteredItems = React.useMemo(() => {
    let filteredOrders = [...orders];

    if (hasSearchFilter) {
      filteredOrders = filteredOrders.filter((order) =>
        order.status!.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredOrders;
  }, [orders, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Order, b: Order) => {
      const first = a[sortDescriptor.column as keyof Order] as number;
      const second = b[sortDescriptor.column as keyof Order] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);
  const isValidUrl = (url: string) => {
    return url.match(/(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i) !== null;
  };

  const [galleryImages, setGalleryImages] = useState<Image_[]>([]); // Lưu danh sách ảnh cho modal gallery

  const renderCell = React.useCallback((order: Order, columnKey: React.Key) => {
    const cellValue = order[columnKey as keyof Order]!;
    const isLongText = typeof cellValue === "string" && cellValue.length > 20;
    switch (columnKey) {
      case "isDelete":
        return (
          <div>
            {!cellValue ? (
              <span className="text-green-500">Active</span>
            ) : (
              <span className="text-red-500">Deleted</span>
            )}
          </div>
        );
      // case "images":
      //   const images_ = cellValue as Image_[];
      //   const MAX_VISIBLE_IMAGES = 1; // Hiển thị tối đa 3 ảnh
      //   return images_ && images_.length > 0 ? (
      //     <div className="flex space-x-2">
      //       {images_.slice(0, MAX_VISIBLE_IMAGES).map((imageObj, index) =>
      //         isValidUrl(imageObj.imageUrl) ? (
      //           <Image
      //             key={index}
      //             src={imageObj.imageUrl}
      //             alt={`Order Image ${index + 1}`}
      //             width={50}
      //             height={50}
      //             objectFit="cover"
      //             style={{ borderRadius: "5px", cursor: "pointer" }}
      //           />
      //         ) : (
      //           <div
      //             key={index}
      //             style={{
      //               width: 50,
      //               height: 50,
      //               borderRadius: "5px",
      //               backgroundColor: "#f0f0f0",
      //             }}
      //           >
      //             <span
      //               style={{
      //                 display: "block",
      //                 width: "100%",
      //                 height: "100%",
      //                 textAlign: "center",
      //                 lineHeight: "50px",
      //                 color: "#999",
      //               }}
      //             >
      //               No Image
      //             </span>
      //           </div>
      //         )
      //       )}
      //       {images_.length > MAX_VISIBLE_IMAGES && (
      //         <span style={{ cursor: "pointer", color: "blue" }}>
      //           +{images_.length - MAX_VISIBLE_IMAGES} more
      //         </span>
      //       )}
      //     </div>
      //   ) : (
      //     <div
      //       style={{
      //         width: 50,
      //         height: 50,
      //         borderRadius: "5px",
      //         backgroundColor: "#f0f0f0",
      //       }}
      //     >
      //       <span
      //         style={{
      //           display: "block",
      //           width: "100%",
      //           height: "100%",
      //           textAlign: "center",
      //           lineHeight: "50px",
      //           color: "#999",
      //         }}
      //       >
      //         No Image
      //       </span>
      //     </div>
      //   );

      // case "brand":
      //   const brand_ = cellValue as Brand;
      //   return (
      //     <Tooltip
      //       content={brand_ ? brand_.name : "Unknown"}
      //       placement="top"
      //       trigger={isLongText ? "focus" : undefined}
      //     >
      //       <div
      //         style={{
      //           whiteSpace: "nowrap",
      //           overflow: "hidden",
      //           textOverflow: "ellipsis",
      //           maxWidth: "200px",
      //         }}
      //       >
      //         {brand_ ? (
      //           <div>
      //             {brand_.name}
      //             <p className="text-xs text-gray-500">{brand_._id}</p>
      //             <br /> {/* Xuống dòng */}
      //           </div>
      //         ) : (
      //           "Unknown"
      //         )}
      //       </div>
      //     </Tooltip>
      //   );

      // case "category":
      //   const category_ = cellValue as Brand;
      //   return (
      //     <Tooltip
      //       content={category_ ? category_.name : "Unknown"}
      //       placement="top"
      //       trigger={isLongText ? "focus" : undefined}
      //     >
      //       <div
      //         style={{
      //           whiteSpace: "nowrap",
      //           overflow: "hidden",
      //           textOverflow: "ellipsis",
      //           maxWidth: "200px",
      //         }}
      //       >
      //         {category_ ? (
      //           <div>
      //             {category_.name}
      //             <p className="text-xs text-gray-500">{category_._id}</p>
      //             <br /> {/* Xuống dòng */}
      //           </div>
      //         ) : (
      //           "Unknown"
      //         )}
      //       </div>
      //     </Tooltip>
      //   );

      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-400" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => {
                    setSelectedOrder(order);
                  }}
                  onPress={onOpen}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setSelectedOrder(order);
                  }}
                  onPress={onOpenDelete}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search by name..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              className="bg-foreground text-background"
              endContent={<PlusIcon />}
              size="sm"
              onClick={() => {
                setSelectedOrder(null);
              }}
              onPress={onOpen}
            >
              Add New Order
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {orders.length} orders
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    orders.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${items.length} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    []
  );

  // const handleAddOrUpdateOrder = (order: Order) => {
  //   setOrders((prevOrders) => {
  //     const index = prevOrders.findIndex((p) => p._id === order._id);
  //     if (index !== -1) {
  //       // Nếu sản phẩm đã tồn tại, cập nhật
  //       const updatedOrders = [...prevOrders];
  //       updatedOrders[index] = order;
  //       return updatedOrders;
  //     } else {
  //       // Nếu là sản phẩm mới, thêm vào danh sách
  //       return [...prevOrders, order];
  //     }
  //   });
  // };

  return (
    <>
      <Table
        isCompact
        removeWrapper
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper:
              "after:bg-foreground after:text-background text-background",
          },
        }}
        classNames={classNames}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No orders found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AddOrUpdateOrder
        data={selectedOrder} // Truyền dữ liệu sản phẩm
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        // onOrderSave={handleAddOrUpdateOrder}
      />

      <Modal
        isOpen={isDeleteOpen}
        onOpenChange={onOpenChangeDelete}
        placement="top-center"
      >
        <ModalContent>
          <ModalHeader>Xác nhận xóa sản phẩm</ModalHeader>
          <ModalBody>Bạn có chắc chắn muốn xóa sản phẩm?</ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onClick={onOpenChangeDelete}>
              Hủy
            </Button>
            <Button color="primary" onClick={handleDeleteOrder}>
              Xóa
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
