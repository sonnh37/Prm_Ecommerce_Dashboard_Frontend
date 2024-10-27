import {
  Button,
  CalendarDate,
  DateInput,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Cart } from "@/types/cart";
import cartService from "@/services/cart-service";

interface AddOrUpdateCartProps {
  data?: Cart | null;
  isOpen: boolean;
  onOpenChange: () => void;
  onCartSave: (cart: Cart) => void;
}

export const AddOrUpdateCart: React.FC<AddOrUpdateCartProps> = ({
  data = null,
  isOpen,
  onOpenChange,
  onCartSave,
}) => {
  const [cart, setCart] = useState<Cart>({
    id: 0,
    userId: 0,
    date: "",
    // products: [],
  });

  useEffect(() => {
    if (data) {
      setCart(data);
    } else {
      setCart({
        id: 0,
        userId: 0,
        date: "",
        // products: [],
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCart({ ...cart, [name]: value });
  };

  const handleAddOrUpdateCart = async () => {
    try {
      let savedCart;
      if (data) {
        savedCart = await cartService.update(cart.id, cart); // Cập nhật sản phẩm
      } else {
        savedCart = await cartService.create(cart); // Thêm sản phẩm mới
      }
      onCartSave(savedCart);
      onOpenChange(); // Đóng modal
    } catch (error) {
      console.error("Failed to add or update cart:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        <ModalHeader>{data ? "Update Cart" : "Add Cart"}</ModalHeader>
        <ModalBody>
          <Input
            label="User Id"
            name="userId"
            value={cart.userId.toString()}
            onChange={handleChange}
            variant="bordered"
          />
          <Input
            label="Date created"
            type="date"
            value={cart.date} // Giá trị mặc định
            onChange={handleChange} // Hàm xử lý thay đổi
            placeholder="yyyy-mm-dd"
            className="max-w-sm"
            variant="bordered"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onClick={onOpenChange}>
            Close
          </Button>
          <Button color="primary" onPress={handleAddOrUpdateCart}>
            {data ? "Update" : "Add"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
