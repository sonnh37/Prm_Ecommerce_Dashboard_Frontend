import { Const } from "@/libs/const";
import BaseService from "./base-service";
import { Category } from "@/types/product";

class CategoryService extends BaseService<Category> {
    constructor() {
        super(Const.API_CATEGORY);
    }
}

export default new CategoryService();