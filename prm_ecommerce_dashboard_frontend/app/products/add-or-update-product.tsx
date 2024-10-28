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
import { Brand, Image_, Product } from "@/types/product";
import brandService from "@/services/brand-service";
import imageService from "@/services/image-service";

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
  onProductSave,
}) => {
  const [product, setProduct] = useState<Product>({
    _id: "",
    name: "",
    price: 0,
    brand: { _id: "", name: "" },
    category: "",
    description: "",
    quantitySold: 0,
    origin: "",
    status: "",
    isDelete: false,
    images: [], // Trường images
  });
  const [brands, setBrands] = useState<Brand[]>([]);
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

    const fetchAvailableImages = async () => {
      try {
        // Giả sử bạn có dịch vụ để lấy danh sách hình ảnh
        const images = await imageService.fetchAll(); // Lấy danh sách hình ảnh có sẵn
        setAvailableImages(images); // Giả sử images là mảng đường dẫn hình ảnh
      } catch (error) {
        console.error("Failed to fetch available images:", error);
      }
    };

    fetchBrands();
    fetchAvailableImages();

    if (data) {
      setProduct(data);
    } else {
      setProduct({
        _id: "",
        name: "",
        price: 0,
        brand: { _id: "", name: "" },
        category: "",
        description: "",
        quantitySold: 0,
        origin: "",
        status: "",
        isDelete: false,
        images: [], // Reset images khi không có dữ liệu
      });
    }
  }, [data]);

  const handleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBrandId = event.target.value;
    const selectedBrand = brands.find((brand) => brand._id === selectedBrandId);
    setProduct({ ...product, brand: selectedBrand || { _id: "", name: "" } });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleAddOrUpdateProduct = async () => {
    try {
      let savedProduct;
      if (data) {
        console.log("check_input", product)
        //savedProduct = await productService.update(product._id, product); // Cập nhật sản phẩm
      } else {
        savedProduct = await productService.create(product); // Thêm sản phẩm mới
      }
      //onProductSave(savedProduct);
      onOpenChange(); // Đóng modal
    } catch (error) {
      console.error("Failed to add or update product:", error);
    }
  };

  const handleAddImage = (newImage: Image_) => {
    const isImageExist = product.images.some(image => image._id === newImage._id);
  
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
            label="Brand"
            placeholder="Select a brand"
            onChange={handleBrandChange}
            value={product.brand._id}
          >
            {brands.map((brand) => (
              <SelectItem key={brand._id} value={brand._id}>
                {brand.name}
              </SelectItem>
            ))}
          </Select>
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
            label="Origin"
            name="origin"
            value={product.origin}
            onChange={handleChange}
            variant="bordered"
          />

          {/* Hiển thị hình ảnh */}
          <div className="flex flex-wrap gap-2 mt-4">
            {product.images.map((image) => (
              <Image
                key={image._id}
                src={image.imageUrl}
                alt={product.name}
                width={100}
                height={100}
                
                style={{ borderRadius: "5px" }}
              />
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
