import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Image,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import orderService from "@/services/order-service";
import { Order } from "@/types/order";
import brandService from "@/services/brand-service";
import imageService from "@/services/image-service";
import categoryService from "@/services/category-service";

interface AddOrUpdateOrderProps {
  data?: Order | null;
  isOpen: boolean;
  onOpenChange: () => void;
  // onOrderSave: (order: Order) => void;
}

export const AddOrUpdateOrder: React.FC<AddOrUpdateOrderProps> = ({
  data = null,
  isOpen,
  onOpenChange,
  // onOrderSave,
}) => {
  const [order, setOrder] = useState<Order>({
    _id: undefined,
    totalPrice: 0,
    user: "", // Set default values for brand and category
    cart: "",
    voucher: "",
    priceBeforeShip: 0,
    date: "",
    status: "",
    isDeleted: false,
    products: [],
  });
  // const [brands, setBrands] = useState<Brand[]>([]);
  // const [categories, setCategories] = useState<Category[]>([]);
  // const [availableImages, setAvailableImages] = useState<Image_[]>([]); // Danh sách hình ảnh có sẵn

  useEffect(() => {
    // const fetchBrands = async () => {
    //   try {
    //     const fetchedBrands = await brandService.fetchAll();
    //     setBrands(fetchedBrands);
    //   } catch (error) {
    //     console.error("Failed to fetch brands:", error);
    //   }
    // };

    // const fetchCategories = async () => {
    //   try {
    //     const fetchedCategories = await categoryService.fetchAll();
    //     setCategories(fetchedCategories);
    //   } catch (error) {
    //     console.error("Failed to fetch categories:", error);
    //   }
    // };

    // const fetchAvailableImages = async () => {
    //   try {
    //     const images = await imageService.fetchAll();
    //     setAvailableImages(images);
    //   } catch (error) {
    //     console.error("Failed to fetch available images:", error);
    //   }
    // };

    // fetchBrands();
    // fetchAvailableImages();
    // fetchCategories();

    console.log("check_data", data);

    if (data) {
      setOrder({
        ...data,
      });
    } else {
      setOrder({
        _id: undefined,
        totalPrice: 0,
        user: "",
        cart: "",
        voucher: "",
        priceBeforeShip: 0,
        date: "",
        status: "",
        isDeleted: false,
        products: [],
      });
    }
  }, [data]);

  useEffect(() => {
    console.log("check_order", order);
  }, [order]);

  // const handleBrandChange = (e: any) => {
  //   const selectedBrandId = e.target.value;
  //   const selectedBrand = brands.find((brand) => brand._id === selectedBrandId);
  //   setOrder((prevOrder) => ({
  //     ...prevOrder,
  //     brand: selectedBrand || { _id: undefined, name: "" },
  //   }));
  // };

  // const handleCategoryChange = (e: any) => {
  //   const selectedCategoryId = e.target.value;
  //   const selectedCategory = categories.find(
  //     (category) => category._id === selectedCategoryId
  //   );
  //   setOrder((prevOrder) => ({
  //     ...prevOrder,
  //     category: selectedCategory || {
  //       _id: undefined,
  //       name: "",
  //       isDelete: false,
  //     },
  //   }));
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  // const handleRemoveImage = (imageToRemove: Image_) => {
  //   setOrder({
  //     ...order,
  //     images: order.images.filter((image) => image._id !== imageToRemove._id),
  //   });
  // };

  const handleAddOrUpdateOrder = async () => {
    try {
      let savedOrder;
      console.log("check_input", order);
      order.status = "Pending";
      if (data?._id) {
        // savedOrder = await orderService.update(order._id!, order); // Cập nhật sản phẩm
      } else {
        // savedOrder = await orderService.create(order); // Thêm sản phẩm mới
      }
      // window.location.reload();
      onOpenChange(); // Đóng modal
    } catch (error) {
      console.error("Failed to add or update order:", error);
    }
  };

  // const handleAddImage = (newImage: Image_) => {
  //   const isImageExist = order.images.some(
  //     (image) => image._id === newImage._id
  //   );

  //   if (!isImageExist) {
  //     setOrder({ ...order, images: [...order.images, newImage] });
  //   }
  // };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        <ModalHeader>{data ? "Update Order" : "Add Order"}</ModalHeader>
        <ModalBody>
          <Input
            label="Total Price"
            name="totalPrice"
            type="number"
            value={order.totalPrice.toString()}
            onChange={handleChange}
            variant="bordered"
          />
           <Input
            label="Price before ship"
            name="priceBeforeShip"
            type="number"
            value={order.priceBeforeShip.toString()}
            onChange={handleChange}
            variant="bordered"
          />
          {/* <Select
            disallowEmptySelection
            items={brands}
            defaultSelectedKeys={[order.brand?.name!]} // Sử dụng name làm giá trị mặc định
            label="Brand"
            placeholder="Select a brand"
            onChange={handleBrandChange}
            value={order.brand?._id}
          >
            {brands.map((brand) => (
              <SelectItem key={brand._id!} value={brand._id}>
                {brand.name}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Category"
            placeholder="Select a category"
            onChange={handleCategoryChange}
            defaultSelectedKeys={[order.category?.name!]} // Thiết lập mặc định khi render lần đầu
            value={order.category?._id || undefined} // Đảm bảo cập nhật khi order thay đổi
          >
            {categories.map((category) => (
              <SelectItem key={category._id!} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </Select> */}
          <Input
            label="Date"
            name="date"
            value={order.date}
            onChange={handleChange}
            variant="bordered"
          />

          {/* Hiển thị hình ảnh */}
          {/* <div className="flex flex-wrap gap-2 mt-4">
            {order.images.map((image) => (
              <div className="relative inline-block" key={image._id}>
                <Image
                  src={image.imageUrl}
                  alt={order.name}
                  width={100}
                  height={100}
                  className="cursor-pointer rounded"
                  onClick={() => handleRemoveImage(image)}
                />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h4>Select Images to Add:</h4>
            <div className="flex flex-wrap gap-2">
              {availableImages.map((imageUrl) => (
                <Image
                  key={imageUrl._id}
                  src={imageUrl.imageUrl}
                  alt={`Available image`}
                  width={50}
                  height={50}
                  style={{ borderRadius: "5px", cursor: "pointer" }}
                  onClick={() => handleAddImage(imageUrl)} // Truyền đối tượng Image khi nhấn
                />
              ))}
            </div>
          </div> */}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onClick={onOpenChange}>
            Close
          </Button>
          <Button color="primary" onPress={handleAddOrUpdateOrder}>
            {data ? "Update" : "Add"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
