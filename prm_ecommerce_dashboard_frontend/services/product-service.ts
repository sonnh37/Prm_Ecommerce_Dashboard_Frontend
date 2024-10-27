import { Const } from "@/libs/const";
import BaseService from "./base-service";
import { Product } from "@/types/product";

class ProductService extends BaseService<Product> {
    constructor() {
        super(Const.API_PRODUCT);
    }
}

export default new ProductService();