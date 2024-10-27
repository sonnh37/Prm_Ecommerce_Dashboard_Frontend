"use client";

import {
  ChevronDownIcon,
  PlusIcon,
  SearchIcon,
  VerticalDotsIcon,
} from "@/components/icons";
import { capitalize } from "@/libs/utils";
import productService from "@/services/product-service";
import { Product } from "@/types/product";
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
import { AddOrUpdateProduct } from "./add-or-update-product";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "image",
  "title",
  "price",
  "category",
  "description",
  "actions",
];

export default function App() {
  const [products, setProducts] = useState<Product[]>([]); // Khởi tạo state cho products

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

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const pages = Math.ceil(products.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  // useEffect để fetch dữ liệu khi component mount
  useEffect(() => {
    if (products.length == 0) {
      const fetchData = async () => {
        try {
          const data = await productService.fetchAll();
          setProducts(data);
        } catch (error) {
          console.error("Failed to fetch products:", error);
        }
      };
  
      fetchData();
    }
  }, []);

  const handleDeleteProduct = async () => {
    try {
      if (selectedProduct) {
        await productService.delete(selectedProduct.id);
        onOpenChangeDelete(); // Đóng modal sau khi xóa thành công
        // Cập nhật lại danh sách sản phẩm nếu cần
        setProducts((prevProducts) => 
          prevProducts.filter(product => product.id !== selectedProduct.id)
        );
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  // const renderViewModal = () => (
  //   <Modal isOpen={!!viewProduct} onOpenChange={() => setViewProduct(null)}>
  //     <ModalContent>
  //       <ModalHeader>View Product</ModalHeader>
  //       <ModalBody>
  //         {viewProduct && (
  //           <>
  //             <p>Title: {viewProduct.title}</p>
  //             <p>Price: {viewProduct.price}</p>
  //             <p>Category: {viewProduct.category}</p>
  //             <p>Description: {viewProduct.description}</p>
  //             <Image src={viewProduct.image} alt="Product Image" width={200} height={200} />
  //           </>
  //         )}
  //       </ModalBody>
  //       <ModalFooter>
  //         <Button onClick={() => setViewProduct(null)}>Close</Button>
  //       </ModalFooter>
  //     </ModalContent>
  //   </Modal>
  // );

  const filteredItems = React.useMemo(() => {
    let filteredProducts = [...products];

    if (hasSearchFilter) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredProducts;
  }, [products, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Product, b: Product) => {
      const first = a[sortDescriptor.column as keyof Product] as number;
      const second = b[sortDescriptor.column as keyof Product] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);
  const isValidUrl = (url: string) => {
    return url.match(/(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i) !== null;
  };
  const renderCell = React.useCallback(
    (product: Product, columnKey: React.Key) => {
      const cellValue = product[columnKey as keyof Product];
      const isLongText = typeof cellValue === "string" && cellValue.length > 20;
      switch (columnKey) {
        case "image":
          return (
            isValidUrl(cellValue.toString()) ? (
              <Image
                src={cellValue.toString()} // Chỉ gán nếu URL hợp lệ
                alt="Product Image"
                width={50}
                height={50}
                objectFit="cover" // Đảm bảo ảnh được cắt vừa khung
                style={{ borderRadius: "5px" }} // Tùy chọn thêm cho góc bo tròn
              />
            ) : (
              <div style={{ width: 50, height: 50, borderRadius: '5px', backgroundColor: '#f0f0f0' }}>
                {/* Bạn có thể thêm hình ảnh mặc định ở đây */}
                <span style={{ display: 'block', width: '100%', height: '100%', textAlign: 'center', lineHeight: '50px', color: '#999' }}>No Image</span>
              </div>
            )
          );
        case "title":
          return (
            <Tooltip
              content={cellValue}
              placement="top"
              trigger={isLongText ? "focus" : undefined}
            >
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "200px",
                }}
              >
                {cellValue}
              </div>
            </Tooltip>
          );
        case "description":
          return (
            <Tooltip
              content={cellValue}
              placement="top"
              trigger={isLongText ? "focus" : undefined}
            >
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "200px",
                }}
              >
                {cellValue}
              </div>
            </Tooltip>
          );
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
                      setSelectedProduct(product);
                    }}
                    onPress={onOpen}
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      setSelectedProduct(product);
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
    },
    []
  );

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
              className="mb-4"
              color="primary"
              onClick={() => {
                setSelectedProduct(null);
              }}
              onPress={onOpen}
            >
              <PlusIcon /> Add New Product
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {products.length} products
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
    products.length,
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

  const handleAddOrUpdateProduct = (product: Product) => {
    setProducts((prevProducts) => {
      const index = prevProducts.findIndex((p) => p.id === product.id);
      if (index !== -1) {
        // Nếu sản phẩm đã tồn tại, cập nhật
        const updatedProducts = [...prevProducts];
        updatedProducts[index] = product; // Cập nhật sản phẩm
        return updatedProducts;
      } else {
        // Nếu là sản phẩm mới, thêm vào danh sách
        return [...prevProducts, product];
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
        <TableBody emptyContent={"No products found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <AddOrUpdateProduct
        data={selectedProduct} // Truyền dữ liệu sản phẩm
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onProductSave={handleAddOrUpdateProduct}
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
            <Button color="primary" onClick={handleDeleteProduct}>
              Xóa
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
