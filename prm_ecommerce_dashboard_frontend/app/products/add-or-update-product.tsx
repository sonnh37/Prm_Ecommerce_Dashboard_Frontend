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
import productService from "@/services/product-service";
import { Brand, Category, Image_, Product } from "@/types/product";
import brandService from "@/services/brand-service";
import imageService from "@/services/image-service";
import categoryService from "@/services/category-service";

interface AddOrUpdateProductProps {
  data?: Product | null;
  isOpen: boolean;
  onOpenChange: () => void;
  // onProductSave: (product: Product) => void;
}

export const AddOrUpdateProduct: React.FC<AddOrUpdateProductProps> = ({
  data = null,
  isOpen,
  onOpenChange,
  // onProductSave,
}) => {
  const [product, setProduct] = useState<Product>({
    _id: undefined,
    name: "",
    price: 0,
    brand: undefined, // Set default values for brand and category
    category: undefined,
    description: "",
    quantitySold: 0,
    origin: "",
    status: "",
    isDelete: false,
    images: [],
  });
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableImages, setAvailableImages] = useState<Image_[]>([]); // Danh sách hình ảnh có sẵn

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const fetchedBrands = await brandService.fetchAll();
        setBrands(fetchedBrands);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const fetchedCategories = await categoryService.fetchAll();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const fetchAvailableImages = async () => {
      try {
        const images = await imageService.fetchAll();
        setAvailableImages(images);
      } catch (error) {
        console.error("Failed to fetch available images:", error);
      }
    };

    fetchBrands();
    fetchAvailableImages();
    fetchCategories();

    if (data) {
      setProduct({
        ...data,
      });
    } else {
      setProduct({
        _id: undefined,
        name: "",
        price: 0,
        brand: undefined,
        category: undefined,
        description: "",
        quantitySold: 0,
        origin: "",
        status: "",
        isDelete: false,
        images: [],
      });
    }
  }, [data]);

  useEffect(() => {
    console.log("check_product", product);
  }, [product]);

  const handleBrandChange = (e: any) => {
    const selectedBrandId = e.target.value;
    const selectedBrand = brands.find((brand) => brand._id === selectedBrandId);
    setProduct((prevProduct) => ({
      ...prevProduct,
      brand: selectedBrand || { _id: undefined, name: "" },
    }));
  };

  const handleCategoryChange = (e: any) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = categories.find(
      (category) => category._id === selectedCategoryId
    );
    setProduct((prevProduct) => ({
      ...prevProduct,
      category: selectedCategory || {
        _id: undefined,
        name: "",
        isDelete: false,
      },
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleRemoveImage = (imageToRemove: Image_) => {
    setProduct({
      ...product,
      images: product.images.filter((image) => image._id !== imageToRemove._id),
    });
  };

  const handleAddOrUpdateProduct = async () => {
    try {
      let savedProduct;
      console.log("check_input", product);
      product.status = "Available";
      if (data?._id) {
        savedProduct = await productService.update(product._id!, product); // Cập nhật sản phẩm
      } else {
        savedProduct = await productService.create(product); // Thêm sản phẩm mới
      }
      //onProductSave(savedProduct);
      window.location.reload();
      onOpenChange(); // Đóng modal
    } catch (error) {
      console.error("Failed to add or update product:", error);
    }
  };

  const handleAddImage = (newImage: Image_) => {
    const isImageExist = product.images.some(
      (image) => image._id === newImage._id
    );

    if (!isImageExist) {
      setProduct({ ...product, images: [...product.images, newImage] });
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        <ModalHeader>{data ? "Update Product" : "Add Product"}</ModalHeader>
        <ModalBody>
          <Input
            label="Name"
            name="name"
            value={product.name}
            onChange={handleChange}
            variant="bordered"
          />
          <Input
            label="Price"
            name="price"
            type="number"
            value={product.price.toString()}
            onChange={handleChange}
            variant="bordered"
          />
          <Select
            defaultSelectedKeys={[]} // Sử dụng name làm giá trị mặc định
            selectedKeys={
              product.brand ? new Set([product.brand?._id!]) : new Set()
            }
            label="Brand"
            placeholder="Select a brand"
            onChange={handleBrandChange}
            value={product.brand?._id}
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
            selectedKeys={
              product.category ? new Set([product.category?._id!]) : new Set()
            }
            value={product.category?._id || undefined}
          >
            {categories.map((category) => (
              <SelectItem key={category._id!} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </Select>
          <Input
            label="Description"
            name="description"
            value={product.description}
            onChange={handleChange}
            variant="bordered"
          />
          <Input
            label="Origin"
            name="origin"
            value={product.origin}
            onChange={handleChange}
            variant="bordered"
          />

          {/* Hiển thị hình ảnh */}
          <div className="flex flex-wrap gap-2 mt-4">
            {product.images.map((image) => (
              <div className="relative inline-block" key={image._id}>
                <Image
                  src={image.imageUrl}
                  alt={product.name}
                  width={100}
                  height={100}
                  className="cursor-pointer rounded"
                  onClick={() => handleRemoveImage(image)}
                />
              </div>
            ))}
          </div>

          {/* Chọn hình ảnh từ danh sách có sẵn */}
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
          </div>
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
