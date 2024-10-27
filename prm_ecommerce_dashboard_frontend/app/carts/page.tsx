"use client";

import {
  ChevronDownIcon,
  PlusIcon,
  SearchIcon,
  VerticalDotsIcon,
} from "@/components/icons";
import { capitalize } from "@/libs/utils";
import cartService from "@/services/cart-service";
import { Cart } from "@/types/cart";
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
import { AddOrUpdateCart } from "./add-or-update-cart";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "userId",
  "date",
  "actions",
];

export default function App() {
  const [carts, setCarts] = useState<Cart[]>([]); // Khởi tạo state cho carts

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

  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);

  const pages = Math.ceil(carts.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  // useEffect để fetch dữ liệu khi component mount
  useEffect(() => {
    if (carts.length == 0) {
      const fetchData = async () => {
        try {
          const data = await cartService.fetchAll();
          console.log("check", data)
          setCarts(data);
        } catch (error) {
          console.error("Failed to fetch carts:", error);
        }
      };

      fetchData();
    }
  }, []);

  const handleDeleteCart = async () => {
    try {
      if (selectedCart) {
        await cartService.delete(selectedCart.id);
        onOpenChangeDelete(); // Đóng modal sau khi xóa thành công
        // Cập nhật lại danh sách sản phẩm nếu cần
        setCarts((prevCarts) =>
          prevCarts.filter((cart) => cart.id !== selectedCart.id)
        );
      }
    } catch (error) {
      console.error("Failed to delete cart:", error);
    }
  };

  // const renderViewModal = () => (
  //   <Modal isOpen={!!viewCart} onOpenChange={() => setViewCart(null)}>
  //     <ModalContent>
  //       <ModalHeader>View Cart</ModalHeader>
  //       <ModalBody>
  //         {viewCart && (
  //           <>
  //             <p>Title: {viewCart.title}</p>
  //             <p>Price: {viewCart.price}</p>
  //             <p>Category: {viewCart.category}</p>
  //             <p>Description: {viewCart.description}</p>
  //             <Image src={viewCart.image} alt="Cart Image" width={200} height={200} />
  //           </>
  //         )}
  //       </ModalBody>
  //       <ModalFooter>
  //         <Button onClick={() => setViewCart(null)}>Close</Button>
  //       </ModalFooter>
  //     </ModalContent>
  //   </Modal>
  // );

  const filteredItems = React.useMemo(() => {
    let filteredCarts = [...carts];

    if (hasSearchFilter) {
      filteredCarts = filteredCarts.filter((cart) =>
        cart.userId.toString().toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredCarts;
  }, [carts, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Cart, b: Cart) => {
      const first = a[sortDescriptor.column as keyof Cart] as number;
      const second = b[sortDescriptor.column as keyof Cart] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);
  const renderCell = React.useCallback((cart: Cart, columnKey: React.Key) => {
    if (!cart || typeof columnKey !== "string") {
      return null; // Hoặc có thể render một thông báo lỗi
    }

    const cellValue = cart[columnKey as keyof Cart];
    const isLongText = typeof cellValue === "string" && cellValue.length > 20;
    switch (columnKey) {
      // case "products":
      //   return (
      //     <ul>
      //       {cart.products.map((product) => (
      //         <li key={product.productId}>
      //           Product ID: {product.productId}, Quantity: {product.quantity}
      //         </li>
      //       ))}
      //     </ul>
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
                <DropdownItem>View</DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setSelectedCart(cart);
                  }}
                  onPress={onOpen}
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setSelectedCart(cart);
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
                setSelectedCart(null);
              }}
              onPress={onOpen}
            >
              Add New Cart
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {carts.length} carts
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
    carts.length,
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

  const handleAddOrUpdateCart = (cart: Cart) => {
    setCarts((prevCarts) => {
      const index = prevCarts.findIndex((p) => p.id === cart.id);
      if (index !== -1) {
        // Nếu sản phẩm đã tồn tại, cập nhật
        const updatedCarts = [...prevCarts];
        updatedCarts[index] = cart; // Cập nhật sản phẩm
        return updatedCarts;
      } else {
        // Nếu là sản phẩm mới, thêm vào danh sách
        return [...prevCarts, cart];
      }
    });
  };

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
        <TableBody emptyContent={"No carts found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AddOrUpdateCart
        data={selectedCart} // Truyền dữ liệu sản phẩm
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onCartSave={handleAddOrUpdateCart}
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
            <Button color="primary" onClick={handleDeleteCart}>
              Xóa
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
