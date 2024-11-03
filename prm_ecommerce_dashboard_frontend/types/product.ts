export interface Image_ {
  _id?: string;
  imageUrl?: string;
  product?: string;
  __v: number;
}

export interface Brand {
  _id?: string;
  name?: string;
}

export interface Category {
  _id?: string;
  name?: string;
  isDelete?: boolean;
}

export interface Product {
  _id?: string;
  name?: string;
  price: number;
  brand?: Brand;
  category?: Category;
  description?: string;
  quantitySold: number;
  origin?: string;
  status?: string;
  isDelete?: boolean;
  images: Image_[];
}
