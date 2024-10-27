import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import productService from "@/services/product-service";
import { Product } from "@/types/product";

interface AddOrUpdateProductProps {
  data?: Product | null;
  isOpen: boolean;
  onOpenChange: () => void;
  onProductSave: (product: Product) => void;
}

export const AddOrUpdateProduct: React.FC<AddOrUpdateProductProps> = ({
  data = null,
  isOpen,
  onOpenChange,
  onProductSave
}) => {
  const [product, setProduct] = useState<Product>({
    id: 0,
    title: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (data) {
      setProduct(data);
    } else {
      setProduct({
        id: 0,
        title: "",
        price: "",
        category: "",
        description: "",
        image: "",
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleAddOrUpdateProduct = async () => {
    try {
      let savedProduct;
      if (data) {
        savedProduct = await productService.update(product.id, product); // Cập nhật sản phẩm
      } else {
        savedProduct = await productService.create(product); // Thêm sản phẩm mới
      }
      onProductSave(savedProduct);
      onOpenChange(); // Đóng modal
    } catch (error) {
      console.error("Failed to add or update product:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        <ModalHeader>
          {data ? "Update Product" : "Add Product"}
        </ModalHeader>
        <ModalBody>
          <Input
            label="Title"
            name="title"
            value={product.title}
            onChange={handleChange}
            variant="bordered"
          />
          <Input
            label="Price"
            name="price"
            value={product.price}
            onChange={handleChange}
            variant="bordered"
          />
          <Input
            label="Category"
            name="category"
            value={product.category}
            onChange={handleChange}
            variant="bordered"
          />
          <Input
            label="Description"
            name="description"
            value={product.description}
            onChange={handleChange}
            variant="bordered"
          />
          <Input
            label="Image URL"
            name="image"
            value={product.image}
            onChange={handleChange}
            variant="bordered"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onClick={onOpenChange}>
            Close
          </Button>
          <Button color="primary" onPress={handleAddOrUpdateProduct}>
            {data ? "Update" : "Add"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
