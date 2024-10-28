export interface Image_ {
  _id: string;
  imageUrl: string;
  product: string;
  __v: number;
}

export interface Brand {
  _id: string;
  name: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  brand: Brand; // Thay đổi `brand` thành đối tượng `Brand`
  category: string;
  description: string;
  quantitySold: number;
  origin: string;
  status: string;
  isDelete: boolean;
  images: Image_[]; // Thêm `images` là mảng các đối tượng `Image`
}
