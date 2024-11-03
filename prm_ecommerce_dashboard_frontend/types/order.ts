import { Product } from "./product";

export interface Order {
  _id?: string;
  user?: string;
  cart?: string;
  voucher?: string;
  totalPrice: number;
  priceBeforeShip: number;
  date?: string;
  status?: string;
  isDeleted?: boolean;
  products: Product[];
}
