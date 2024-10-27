import { Const } from "@/libs/const";
import BaseService from "./base-service";
import { Cart } from "@/types/cart";

class CartService extends BaseService<Cart> {
    constructor() {
        super(Const.API_CART);
    }
}

export default new CartService();