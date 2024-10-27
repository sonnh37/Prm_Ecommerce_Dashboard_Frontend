export interface Cart {
  id: number;
  userId: number;
  date: string; // ISO date format
  // products: Product_[];
}

export interface Product_ {
  productId: number;
  quantity: number;
}
