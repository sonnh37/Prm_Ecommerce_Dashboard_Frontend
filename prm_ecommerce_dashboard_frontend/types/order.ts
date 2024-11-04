import { Product } from "./product";

export interface Order {
  _id?: string;
  user?: string;
  voucher?: string;
  totalPrice: number;
  priceBeforeShip: number;
  date?: string;
  status?: string;
  // products: Product[];
}
