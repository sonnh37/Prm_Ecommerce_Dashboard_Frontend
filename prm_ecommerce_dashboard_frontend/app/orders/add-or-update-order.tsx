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
import userService from "@/services/user-service";
import { User } from "@/types/user";

interface AddOrUpdateOrderProps {
  data?: Order | null;
  isOpen: boolean;
  onOpenChange: () => void;
}

export const AddOrUpdateOrder: React.FC<AddOrUpdateOrderProps> = ({
  data = null,
  isOpen,
  onOpenChange,
}) => {
  const [order, setOrder] = useState<Order>({
    _id: undefined,
    totalPrice: 0,
    user: "",
    voucher: undefined,
    priceBeforeShip: 0,
    date: new Date().toISOString(),
    status: "",
  });
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUsers = await userService.fetchAll();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchUser();

    if (data) {
      setOrder({
        ...data,
      });
    } else {
      setOrder({
        _id: undefined,
        totalPrice: 0,
        user: "",
        voucher: undefined,
        priceBeforeShip: 0,
        date: new Date().toISOString(),
        status: "",
      });
    }
  }, [data]);

  useEffect(() => {
    console.log("check_order", order);
  }, [order]);

  const handleUserChange = (e: any) => {
    const selectedUserId = e.target.value;
    setOrder((prevOrder) => ({
      ...prevOrder,
      user: selectedUserId,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  const handleAddOrUpdateOrder = async () => {
    try {
      let savedOrder;
      console.log("check_input", order);
      order.status = "pending";
      if (data?._id) {
        savedOrder = await orderService.update(order._id!, order); // Cập nhật sản phẩm
      } else {
        savedOrder = await orderService.create(order); // Thêm sản phẩm mới
      }
      window.location.reload();
      onOpenChange(); // Đóng modal
    } catch (error) {
      console.error("Failed to add or update order:", error);
    }
  };

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

          <Select
            label="User"
            placeholder="Select a user"
            onChange={handleUserChange}
            selectedKeys={
              order.user ? new Set([order.user]) : new Set()
            }
            value={order.user || undefined}
          >
            {users.map((user) => (
              <SelectItem key={user._id!} value={user._id}>
                {user.name}
              </SelectItem>
            ))}
          </Select>

          {order._id ? (
            <Input
              label="Date"
              isDisabled
              name="date"
              value={order.date}
              onChange={handleChange}
              variant="bordered"
            />
          ) : (
            <></>
          )}

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
